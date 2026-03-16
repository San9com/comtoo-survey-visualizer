"use client";

import Link from "next/link";
import type { SurveyProject } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { exportProjectMarkdown } from "@/lib/export/markdown";
import { downloadText } from "@/lib/export/download";

export function ExportPanel({ project }: { project: SurveyProject }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="text-[13px] font-semibold">Markdown</div>
        <div className="mt-1 text-[13px] text-[var(--muted)]">
          Exports quantitative summaries and insight cards as a research-friendly
          markdown report.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant="subtle"
            onClick={() => {
              const md = exportProjectMarkdown(project);
              const safeName = (project.name || "survey")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
              downloadText(`${safeName || "survey"}-report.md`, md, "text/markdown");
            }}
          >
            Export markdown
          </Button>
          <Link
            className="text-[13px] text-[var(--accent-ink)] underline underline-offset-4"
            href="/report"
          >
            Open print report
          </Link>
        </div>
      </div>

      <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] p-4">
        <div className="text-[13px] font-semibold">Project JSON</div>
        <div className="mt-1 text-[13px] text-[var(--muted)]">
          Full local project state (CSV text, parsing settings, coding, insights)
          for backup or sharing.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button
            variant="subtle"
            onClick={() => {
              downloadText(
                "comtoo-survey-project.json",
                JSON.stringify(project, null, 2),
                "application/json",
              );
            }}
          >
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  );
}

