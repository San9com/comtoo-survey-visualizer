import type { Question, QuestionType } from "@/lib/types";

export type QuantDatum = {
  label: string;
  count: number;
  pct: number; // 0..100 based on responses count
};

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
    // Each option column counts independently. A selection is any non-empty cell.
    for (const row of rows) {
      for (const col of question.columns) {
        const raw = normalizeAnswer(row[col.key] ?? "");
        if (!raw) continue;
        const optionLabel = col.optionLabel ?? raw;
        counts.set(optionLabel, (counts.get(optionLabel) ?? 0) + 1);
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
      if (treatAsMulti && question.type !== "rating") {
        for (const part of splitMulti(raw)) {
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

