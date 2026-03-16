export function getResponseId(row: Record<string, string>, index: number) {
  const candidates = ["Reactie-ID", "Response ID", "ResponseId", "ID"];
  for (const c of candidates) {
    const v = (row[c] ?? "").trim();
    if (v) return v;
  }
  return `row_${index + 1}`;
}

