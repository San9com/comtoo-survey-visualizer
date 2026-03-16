import { tokenize } from "@/lib/patterns/text";

export type SparseVector = Map<string, number>;

export type Doc = {
  id: string;
  text: string;
  tokens: string[];
};

export function buildDocs(items: Array<{ id: string; text: string }>): Doc[] {
  return items
    .map((x) => ({ ...x, tokens: tokenize(x.text) }))
    .filter((d) => d.tokens.length >= 3);
}

export function computeIdf(docs: Doc[]) {
  const df = new Map<string, number>();
  for (const d of docs) {
    const unique = new Set(d.tokens);
    for (const t of unique) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const n = docs.length;
  const idf = new Map<string, number>();
  for (const [t, c] of df.entries()) {
    // Smooth IDF.
    idf.set(t, Math.log((n + 1) / (c + 1)) + 1);
  }
  return idf;
}

export function toTfidfVector(doc: Doc, idf: Map<string, number>): SparseVector {
  const tf = new Map<string, number>();
  for (const t of doc.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  const len = doc.tokens.length;

  const v: SparseVector = new Map();
  for (const [t, c] of tf.entries()) {
    const tfNorm = c / len;
    const w = tfNorm * (idf.get(t) ?? 0);
    if (w > 0) v.set(t, w);
  }
  return v;
}

export function cosineSimilarity(a: SparseVector, b: SparseVector) {
  let dot = 0;
  let na = 0;
  let nb = 0;

  for (const va of a.values()) na += va * va;
  for (const vb of b.values()) nb += vb * vb;

  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [k, v] of small.entries()) {
    const w = large.get(k);
    if (w) dot += v * w;
  }

  const denom = Math.sqrt(na) * Math.sqrt(nb);
  if (!denom) return 0;
  return dot / denom;
}

export function topTerms(vec: SparseVector, n = 6) {
  return [...vec.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t);
}

