import * as React from "react";
import type {
  AiQuestionInsights,
  ParseConfig,
  SurveyProject,
} from "@/lib/types";
import { createEmptyProject, DEFAULT_PARSE_CONFIG } from "@/lib/project/createProject";
import { parseCsv } from "@/lib/csv/parseCsv";
import { detectQuestions } from "@/lib/survey/detectQuestions";
import { readJson, writeJson } from "@/lib/storage";

const STORAGE_KEY = "comtoo_survey_visualiser_project_v1";

type ProjectAction =
  | { type: "project/load"; project: SurveyProject }
  | { type: "project/patch"; patch: Partial<SurveyProject> }
  | { type: "project/reset" }
  | { type: "parse/config"; config: ParseConfig }
  | { type: "csv/set"; name: string; text: string }
  | { type: "csv/parsed"; headers: string[]; rows: Record<string, string>[]; errors: string[] }
  | { type: "ui/selectQuestion"; questionId?: string }
  | { type: "ai/set"; questionId: string; insights: AiQuestionInsights };

type ProjectState = {
  project: SurveyProject;
  parseErrors: string[];
};

function reduce(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case "project/load":
      return { ...state, project: action.project };
    case "project/patch":
      return {
        ...state,
        project: { ...state.project, ...action.patch, updatedAt: Date.now() },
      };
    case "project/reset":
      return { project: createEmptyProject({ parseConfig: DEFAULT_PARSE_CONFIG }), parseErrors: [] };
    case "parse/config":
      return {
        ...state,
        project: { ...state.project, parseConfig: action.config, updatedAt: Date.now() },
      };
    case "csv/set":
      // Keep the project name in sync with the file for a nicer local-first feel.
      const baseName = action.name.replace(/\.(csv|txt)$/i, "").trim();
      return {
        ...state,
        project: {
          ...state.project,
          name: baseName || state.project.name,
          rawCsvName: action.name,
          rawCsvText: action.text,
          updatedAt: Date.now(),
        },
      };
    case "csv/parsed":
      // After parsing, we immediately infer question groups/types from headers + data.
      // This supports the common "checkbox option per column" export format.
      const questions = detectQuestions(action.headers, action.rows).filter(
        (q) => q.type !== "metadata",
      );
      const selectedQuestionId =
        state.project.selectedQuestionId && questions.some((q) => q.id === state.project.selectedQuestionId)
          ? state.project.selectedQuestionId
          : questions[0]?.id;

      return {
        ...state,
        parseErrors: action.errors,
        project: {
          ...state.project,
          headers: action.headers,
          rows: action.rows,
          questions,
          selectedQuestionId,
          updatedAt: Date.now(),
        },
      };
    case "ui/selectQuestion":
      return {
        ...state,
        project: { ...state.project, selectedQuestionId: action.questionId, updatedAt: Date.now() },
      };
    case "ai/set":
      return {
        ...state,
        project: {
          ...state.project,
          aiInsights: { ...state.project.aiInsights, [action.questionId]: action.insights },
          updatedAt: Date.now(),
        },
      };
    default:
      return state;
  }
}

function safeLoadFromStorage(): SurveyProject | null {
  const stored = readJson<unknown>(STORAGE_KEY) as Partial<SurveyProject> | null;
  if (!stored || stored.version !== 1) return null;

  // Migrate older saved state forward safely.
  // (Older versions may not have aiInsights yet.)
  const migrated: SurveyProject = {
    ...(stored as SurveyProject),
    aiInsights: (stored as SurveyProject).aiInsights ?? {},
  };

  return migrated;
}

type ProjectApi = {
  state: ProjectState;
  setParseConfig: (cfg: ParseConfig) => void;
  loadCsv: (name: string, text: string) => void;
  selectQuestion: (questionId?: string) => void;
  setAiInsights: (questionId: string, insights: AiQuestionInsights) => void;
  reset: () => void;
};

const ProjectContext = React.createContext<ProjectApi | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reduce, {
    project: createEmptyProject({ parseConfig: DEFAULT_PARSE_CONFIG }),
    parseErrors: [],
  });

  // Load once on mount (local-first persistence).
  React.useEffect(() => {
    const stored = safeLoadFromStorage();
    if (stored) dispatch({ type: "project/load", project: stored });
  }, []);

  // Autosave project whenever it changes.
  React.useEffect(() => {
    writeJson(STORAGE_KEY, state.project);
  }, [state.project]);

  // Re-parse CSV when raw text or parsing config changes.
  React.useEffect(() => {
    const text = state.project.rawCsvText;
    if (!text) return;
    const parsed = parseCsv(text, state.project.parseConfig);
    dispatch({
      type: "csv/parsed",
      headers: parsed.headers,
      rows: parsed.rows,
      errors: parsed.errors,
    });
  }, [state.project.rawCsvText, state.project.parseConfig]);

  const api: ProjectApi = React.useMemo(
    () => ({
      state,
      setParseConfig: (cfg) => dispatch({ type: "parse/config", config: cfg }),
      loadCsv: (name, text) => dispatch({ type: "csv/set", name, text }),
      selectQuestion: (questionId) => dispatch({ type: "ui/selectQuestion", questionId }),
      setAiInsights: (questionId, insights) =>
        dispatch({ type: "ai/set", questionId, insights }),
      reset: () => dispatch({ type: "project/reset" }),
    }),
    [state],
  );

  return <ProjectContext.Provider value={api}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = React.useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}

