export type ParseDelimiter = ";" | "," | "\t";

export type ParseConfig = {
  delimiter: ParseDelimiter;
  hasHeaderRow: boolean;
  skipEmptyLines: boolean;
};

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "yes_no"
  | "rating"
  | "open_text"
  | "metadata";

export type Question = {
  id: string;
  /**
   * Original column header (for single-column questions), or the base question
   * name (for checkbox questions where each option becomes a separate column).
   */
  label: string;
  type: QuestionType;
  /**
   * For multiple-choice (checkbox-style) questions, we store the columns that
   * belong to the question and their option labels.
   */
  columns: Array<{ key: string; optionLabel?: string }>;
};

export type AiConclusion = {
  title: string;
  observation: string; // what we see in the evidence
  interpretation: string; // why it matters / what it likely means
  implication: string; // what to do in design/product
  confidence: "low" | "medium" | "high";
  evidenceQuotes: string[]; // short verbatim excerpts
};

export type AiQuestionInsights = {
  questionId: string;
  questionLabel: string;
  generatedAt: number;
  /**
   * A short note on how the model approached synthesis (so it feels like a
   * research tool, not a black box).
   */
  methodology: string;
  conclusions: AiConclusion[];
 };

export type SurveyProject = {
  version: 1;
  name: string;
  createdAt: number;
  updatedAt: number;
  parseConfig: ParseConfig;
  rawCsvName?: string;
  rawCsvText?: string;
  rows: Record<string, string>[];
  headers: string[];
  questions: Question[];
  selectedQuestionId?: string;
  // Reserved for future optional AI; current workflow is offline patterns.
  aiInsights?: Record<string, AiQuestionInsights>;
};

