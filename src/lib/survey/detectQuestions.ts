import type { Question, QuestionType } from "@/lib/types";
import { hashString } from "@/lib/hash";

const METADATA_HEADERS = new Set(
  [
    "Reactie-ID",
    "Reactie gestart",
    "Reactie voltooid",
    "IP-adres",
    "Naam van collector",
    "E-mailadres",
    "Naam",
  ].map((s) => s.trim()),
);

function normalizeHeader(raw: string) {
  return (raw ?? "").replace(/\s+/g, " ").trim();
}

function splitCheckboxHeader(header: string): { base: string; option: string | null } {
  // Typical export shape (seen in your CSV):
  // "4. Question text?\n[Option label]"
  const h = header.replace(/\r/g, "");
  const newlineIdx = h.indexOf("\n[");
  if (newlineIdx !== -1) {
    const base = normalizeHeader(h.slice(0, newlineIdx));
    const opt = h.slice(newlineIdx + 2).trim(); // starts with "["
    const option = opt.replace(/^\[/, "").replace(/\]$/, "").trim();
    return { base, option: option || null };
  }

  // Some exports use "Question [Option]" on one line.
  const m = h.match(/^(.*)\s+\[(.*)\]\s*$/);
  if (m) {
    return { base: normalizeHeader(m[1]!), option: normalizeHeader(m[2]!) || null };
  }

  return { base: normalizeHeader(h), option: null };
}

function guessTypeFromValues(values: string[], isGroupedCheckbox: boolean): QuestionType {
  if (isGroupedCheckbox) return "multiple_choice";

  const nonEmpty = values.map((v) => (v ?? "").trim()).filter((v) => v !== "");
  if (nonEmpty.length === 0) return "open_text";

  const uniques = new Set(nonEmpty.map((v) => v.toLowerCase()));
  const uniqueCount = uniques.size;
  const total = nonEmpty.length;
  const uniqueRatio = uniqueCount / Math.max(1, total);

  const yesNo = new Set(["ja", "nee", "yes", "no", "true", "false"]);
  if ([...uniques].every((u) => yesNo.has(u))) return "yes_no";

  // Rating-like: mostly numeric, small bounded set.
  const numeric = nonEmpty
    .map((v) => Number(v.replace(",", ".")))
    .filter((n) => Number.isFinite(n));
  const numericRatio = numeric.length / nonEmpty.length;
  if (numericRatio >= 0.9) {
    const min = Math.min(...numeric);
    const max = Math.max(...numeric);
    if (max - min <= 10 && uniqueCount <= 12) return "rating";
  }

  // Open text: lots of unique answers and/or long strings.
  const avgLen =
    nonEmpty.reduce((s, v) => s + v.length, 0) / Math.max(1, nonEmpty.length);
  if (avgLen >= 40) return "open_text";
  if (uniqueRatio >= 0.6 && uniqueCount >= 12) return "open_text";

  return "single_choice";
}

export function detectQuestions(headers: string[], rows: Record<string, string>[]): Question[] {
  const cleaned = headers.map(normalizeHeader).filter(Boolean);

  const groups = new Map<
    string,
    { label: string; columns: Array<{ key: string; optionLabel?: string }>; isMetadata: boolean }
  >();

  for (const original of cleaned) {
    const { base, option } = splitCheckboxHeader(original);
    const label = base || original;
    const isMetadata = METADATA_HEADERS.has(label);
    const g = groups.get(label) ?? {
      label,
      columns: [],
      isMetadata,
    };
    g.columns.push({ key: original, optionLabel: option ?? undefined });
    groups.set(label, g);
  }

  const questions: Question[] = [];
  for (const g of groups.values()) {
    const isGroupedCheckbox = g.columns.length > 1 && g.columns.some((c) => c.optionLabel);
    const values: string[] = [];

    if (!g.isMetadata) {
      for (const row of rows) {
        if (isGroupedCheckbox) {
          // For checkboxes each option column is typically filled with the option label when selected.
          // We'll treat the group as a whole later; for type inference we can use per-column presence.
          for (const c of g.columns) values.push((row[c.key] ?? "").trim());
        } else {
          values.push((row[g.columns[0]!.key] ?? "").trim());
        }
      }
    }

    const type: QuestionType = g.isMetadata
      ? "metadata"
      : guessTypeFromValues(values, isGroupedCheckbox);

    questions.push({
      id: `q_${hashString(g.label)}`,
      label: g.label,
      type,
      columns: g.columns,
    });
  }

  // Keep metadata first? For a research workspace, we hide metadata from the main list by default.
  questions.sort((a, b) => {
    if (a.type === "metadata" && b.type !== "metadata") return 1;
    if (a.type !== "metadata" && b.type === "metadata") return -1;
    return a.label.localeCompare(b.label, "nl");
  });

  return questions;
}

