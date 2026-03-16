import type { Question, QuestionType } from "@/lib/types";

export type QuantDatum = {
  label: string;
  count: number;
  pct: number; // 0..100 based on responses count
};

export type QuantVisualKind = "pie" | "bar";

function normalizeAnswer(v: string) {
  return (v ?? "").trim();
}

function splitMulti(raw: string) {
  // Common export shape for multi-select in a single column: "A, B, C"
  // We keep it conservative and only split on commas/semicolons when used as separators.
  return raw
    .split(/[,;]\s*/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function shouldTreatAsMultiSelect(values: string[]) {
  const nonEmpty = values.map((v) => v.trim()).filter(Boolean);
  if (nonEmpty.length < 8) return false;
  const withComma = nonEmpty.filter((v) => /[,;]/.test(v)).length;
  const ratio = withComma / nonEmpty.length;
  if (ratio >= 0.12) return true;

  // Fallback heuristic: if average parts > 1.15, it's almost certainly multi-select.
  const avgParts =
    nonEmpty.reduce((s, v) => s + splitMulti(v).length, 0) / Math.max(1, nonEmpty.length);
  return avgParts >= 1.15;
}

function isClosedType(t: QuestionType) {
  return (
    t === "single_choice" ||
    t === "multiple_choice" ||
    t === "yes_no" ||
    t === "rating"
  );
}

export function computeQuant(question: Question, rows: Record<string, string>[]) {
  if (!isClosedType(question.type)) return null;
  const responseCount = rows.length;
  if (responseCount === 0) return { responseCount, data: [] as QuantDatum[] };

  const counts = new Map<string, number>();

  if (question.type === "multiple_choice") {
    // Some exports include an extra "combined answers" column without optionLabel.
    // When option columns are present, only count those to avoid noisy duplicate labels.
    const hasExplicitOptions = question.columns.some((c) => Boolean(c.optionLabel));
    const effectiveColumns = hasExplicitOptions
      ? question.columns.filter((c) => Boolean(c.optionLabel))
      : question.columns;

    // Each option column counts independently. A selection is any non-empty cell.
    for (const row of rows) {
      for (const col of effectiveColumns) {
        const raw = normalizeAnswer(row[col.key] ?? "");
        if (!raw) continue;
        if (col.optionLabel) {
          counts.set(col.optionLabel, (counts.get(col.optionLabel) ?? 0) + 1);
          continue;
        }

        // Fallback for malformed exports where list-like answers appear in one column.
        if (/[,;]/.test(raw)) {
          for (const part of new Set(splitMulti(raw))) {
            counts.set(part, (counts.get(part) ?? 0) + 1);
          }
          continue;
        }

        counts.set(raw, (counts.get(raw) ?? 0) + 1);
      }
    }
  } else {
    const key = question.columns[0]?.key;
    if (!key) return { responseCount, data: [] as QuantDatum[] };

    const rawValues = rows.map((r) => normalizeAnswer(r[key] ?? "")).filter(Boolean);
    const treatAsMulti = shouldTreatAsMultiSelect(rawValues);

    for (const row of rows) {
      const raw = normalizeAnswer(row[key] ?? "");
      if (!raw) continue;
      const shouldSplit = question.type !== "rating" && (treatAsMulti || /[,;]/.test(raw));
      if (shouldSplit) {
        for (const part of new Set(splitMulti(raw))) {
          counts.set(part, (counts.get(part) ?? 0) + 1);
        }
      } else {
        // Ratings may include commas, but we keep the display label as-is.
        counts.set(raw, (counts.get(raw) ?? 0) + 1);
      }
    }
  }

  const data: QuantDatum[] = [...counts.entries()]
    .map(([label, count]) => ({
      label,
      count,
      pct: (count / responseCount) * 100,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "nl"));

  return { responseCount, data };
}

export function pickQuantVisual(data: QuantDatum[]): QuantVisualKind {
  if (data.length <= 1) return "bar";

  const optionCount = data.length;
  const top1 = data[0]?.pct ?? 0;

  // Pie is only useful when there are few, reasonably balanced options.
  if (optionCount <= 5 && top1 <= 72) return "pie";
  return "bar";
}

