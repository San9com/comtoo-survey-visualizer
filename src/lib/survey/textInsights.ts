import { tokenize } from "@/lib/patterns/text";

export type TopToken = {
  token: string;
  count: number;
  pct: number;
};

export function extractTopTokens(
  responses: string[],
  { maxItems = 30, minCount = 2 }: { maxItems?: number; minCount?: number } = {},
): TopToken[] {
  const counts = new Map<string, number>();
  for (const response of responses) {
    for (const token of tokenize(response ?? "")) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }

  const totalResponses = Math.max(1, responses.length);
  return [...counts.entries()]
    .map(([token, count]) => ({
      token,
      count,
      pct: (count / totalResponses) * 100,
    }))
    .filter((x) => x.count >= minCount)
    .sort((a, b) => b.count - a.count || a.token.localeCompare(b.token, "nl"))
    .slice(0, maxItems);
}
