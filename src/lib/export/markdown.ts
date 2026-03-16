import type { SurveyProject } from "@/lib/types";
import { computeQuant } from "@/lib/survey/quant";

function esc(s: string) {
  return (s ?? "").replace(/\r/g, "").trim();
}

export function exportProjectMarkdown(project: SurveyProject) {
  const lines: string[] = [];

  lines.push(`# ${esc(project.name) || "Survey report"}`);
  lines.push("");
  lines.push(`- Responses: **${project.rows.length}**`);
  lines.push(`- Questions: **${project.questions.length}**`);
  lines.push("");

  lines.push("## Quantitative summary");
  lines.push("");

  for (const q of project.questions) {
    const res = computeQuant(q, project.rows);
    if (!res) continue;

    lines.push(`### ${esc(q.label)}`);
    lines.push("");
    if (!res.data.length) {
      lines.push("_No answers found._");
      lines.push("");
      continue;
    }

    for (const d of res.data) {
      const pct = `${d.pct.toFixed(d.pct >= 10 ? 0 : 1)}%`;
      lines.push(`- ${esc(d.label)} — **${d.count}** (${pct})`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

