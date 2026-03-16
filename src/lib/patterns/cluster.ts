import type { Question } from "@/lib/types";
import { buildDocs, computeIdf, cosineSimilarity, topTerms, toTfidfVector } from "@/lib/patterns/tfidf";

export type PatternItem = {
  id: string;
  questionId: string;
  questionLabel: string;
  text: string;
};

export type PatternCluster = {
  id: string;
  label: string;
  size: number;
  keywords: string[];
  questions: Array<{ questionId: string; questionLabel: string; count: number }>;
  examples: string[];
};

function uid(i: number) {
  return `cluster_${i}_${Date.now().toString(16)}`;
}

export function collectOpenTextItems(
  questions: Question[],
  rows: Record<string, string>[],
) {
  const open = questions.filter((q) => q.type === "open_text");
  const items: PatternItem[] = [];
  for (const q of open) {
    const key = q.columns[0]?.key;
    if (!key) continue;
    for (let i = 0; i < rows.length; i++) {
      const text = (rows[i]?.[key] ?? "").trim();
      if (!text) continue;
      items.push({
        id: `${q.id}::${i}`,
        questionId: q.id,
        questionLabel: q.label,
        text,
      });
    }
  }
  return items;
}

export function clusterPatterns(
  items: PatternItem[],
  opts?: { similarityThreshold?: number; maxExamplesPerCluster?: number },
) {
  const similarityThreshold = opts?.similarityThreshold ?? 0.28;
  const maxExamplesPerCluster = opts?.maxExamplesPerCluster ?? 6;

  const docs = buildDocs(items.map((x) => ({ id: x.id, text: x.text })));
  const docById = new Map(items.map((x) => [x.id, x] as const));
  const idf = computeIdf(docs);
  const vectors = new Map<string, ReturnType<typeof toTfidfVector>>();
  for (const d of docs) vectors.set(d.id, toTfidfVector(d, idf));

  // Greedy clustering: for each doc, join the most similar existing cluster.
  const clusters: Array<{ memberIds: string[]; centroid: Map<string, number> }> = [];

  function centroidOf(ids: string[]) {
    const acc = new Map<string, number>();
    for (const id of ids) {
      const v = vectors.get(id);
      if (!v) continue;
      for (const [t, w] of v.entries()) acc.set(t, (acc.get(t) ?? 0) + w);
    }
    const denom = Math.max(1, ids.length);
    for (const [t, w] of acc.entries()) acc.set(t, w / denom);
    return acc;
  }

  for (const d of docs) {
    const v = vectors.get(d.id)!;
    let bestIdx = -1;
    let best = 0;

    for (let i = 0; i < clusters.length; i++) {
      const sim = cosineSimilarity(v, clusters[i]!.centroid);
      if (sim > best) {
        best = sim;
        bestIdx = i;
      }
    }

    if (bestIdx === -1 || best < similarityThreshold) {
      clusters.push({ memberIds: [d.id], centroid: v });
    } else {
      clusters[bestIdx]!.memberIds.push(d.id);
      clusters[bestIdx]!.centroid = centroidOf(clusters[bestIdx]!.memberIds);
    }
  }

  // Summarize clusters.
  const summarized: PatternCluster[] = clusters
    .map((c, idx) => {
      const members = c.memberIds
        .map((id) => docById.get(id))
        .filter(Boolean) as PatternItem[];

      const qCounts = new Map<string, { questionId: string; questionLabel: string; count: number }>();
      for (const m of members) {
        const cur = qCounts.get(m.questionId) ?? {
          questionId: m.questionId,
          questionLabel: m.questionLabel,
          count: 0,
        };
        cur.count += 1;
        qCounts.set(m.questionId, cur);
      }

      const questions = [...qCounts.values()].sort((a, b) => b.count - a.count);
      const keywords = topTerms(c.centroid, 6);
      const label = keywords.slice(0, 3).join(" · ") || "Pattern";
      const examples = members.slice(0, maxExamplesPerCluster).map((m) => m.text);

      return {
        id: uid(idx),
        label,
        size: members.length,
        keywords,
        questions,
        examples,
      };
    })
    .filter((c) => c.size >= 2)
    .sort((a, b) => b.size - a.size);

  return {
    clusters: summarized,
    totalItems: items.length,
    clusteredItems: docs.length,
    threshold: similarityThreshold,
  };
}

