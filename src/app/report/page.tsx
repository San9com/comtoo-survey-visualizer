"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import type { SurveyProject } from "@/lib/types";
import { readJson } from "@/lib/storage";
import { exportProjectMarkdown } from "@/lib/export/markdown";

const STORAGE_KEY = "comtoo_survey_visualiser_project_v1";

function ReportBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[12px] border border-[var(--border)] bg-white p-6 print:border-none print:p-0">
      <div className="text-[12px] font-semibold tracking-[0.12em] text-[var(--faint)]">
        {title.toUpperCase()}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function ReportPage() {
  const [project, setProject] = React.useState<SurveyProject | null>(null);

  React.useEffect(() => {
    const p = readJson<SurveyProject>(STORAGE_KEY);
    setProject(p);
  }, []);

  const md = React.useMemo(() => (project ? exportProjectMarkdown(project) : ""), [project]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto w-full max-w-[980px] px-6 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="mb-6 flex items-start justify-between gap-4 print:hidden">
          <div>
            <div className="text-[20px] font-semibold tracking-tight">Report</div>
            <div className="mt-1 text-[13px] text-[var(--muted)]">
              Print-friendly view of your current local project state.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => window.print()}>
              Print / Save PDF
            </Button>
          </div>
        </div>

        {!project ? (
          <ReportBlock title="No project loaded">
            <div className="text-[14px] text-[var(--muted)]">
              Open the main workspace, upload a CSV, then return here.
            </div>
          </ReportBlock>
        ) : (
          <div className="space-y-4">
            <ReportBlock title="Overview">
              <div className="text-[16px] font-semibold">{project.name}</div>
              <div className="mt-1 text-[13px] text-[var(--muted)]">
                {project.rows.length} responses · {project.questions.length} questions ·{" "}
                {Object.keys(project.aiInsights ?? {}).length} AI insight sets
              </div>
            </ReportBlock>

            <ReportBlock title="Markdown export">
              <pre className="whitespace-pre-wrap rounded-[10px] border border-[var(--border)] bg-[var(--bg)] p-4 text-[13px] leading-6">
                {md}
              </pre>
            </ReportBlock>
          </div>
        )}
      </div>
    </div>
  );
}

