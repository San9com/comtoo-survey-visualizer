import type { ParseConfig, SurveyProject } from "@/lib/types";

export const DEFAULT_PARSE_CONFIG: ParseConfig = {
  delimiter: ";",
  hasHeaderRow: true,
  skipEmptyLines: true,
};

export function createEmptyProject(partial?: Partial<SurveyProject>): SurveyProject {
  const now = Date.now();
  return {
    version: 1,
    name: partial?.name ?? "Untitled project",
    createdAt: partial?.createdAt ?? now,
    updatedAt: now,
    parseConfig: partial?.parseConfig ?? DEFAULT_PARSE_CONFIG,
    rawCsvName: partial?.rawCsvName,
    rawCsvText: partial?.rawCsvText,
    rows: partial?.rows ?? [],
    headers: partial?.headers ?? [],
    questions: partial?.questions ?? [],
    selectedQuestionId: partial?.selectedQuestionId,
    aiInsights: partial?.aiInsights ?? {},
  };
}

