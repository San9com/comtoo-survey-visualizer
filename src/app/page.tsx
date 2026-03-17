"use client";

import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/Button";
import { CsvUploader } from "@/components/csv/CsvUploader";
import { ParseSettingsPanel } from "@/components/csv/ParseSettingsPanel";
import { CsvPreviewTable } from "@/components/csv/CsvPreviewTable";
import { QuestionSidebar } from "@/components/survey/QuestionSidebar";
import { QuantResultsPanel } from "@/components/quant/QuantResultsPanel";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useProject } from "@/lib/project/projectStore";
import { SidebarNav } from "@/components/SidebarNav";

export default function Home() {
  const {
    state,
    setParseConfig,
    loadCsv,
    selectQuestion,
    reset,
  } = useProject();
  const { project, parseErrors } = state;
  const [view, setView] = React.useState<"work" | "export" | "settings">("work");
  const selected = project.questions.find((q) => q.id === project.selectedQuestionId);
  const tr = React.useCallback((s: string) => s, []);

  return (
    <AppShell
      sidebar={
        <div className="p-6">
          <BrandMark />
          <div className="mt-6">
            <SidebarNav
              current={view}
              onSelect={(v) => {
                setView(v);
              }}
            />
          </div>

          <div className="mt-7 border-t border-black/[0.06] pt-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[12px] font-semibold tracking-[0.12em] text-[var(--text)]">
                QUESTIONS
              </div>
              {project.rows.length ? (
                <div className="text-[12px] text-[var(--text)]">
                  {project.questions.length}
                </div>
              ) : null}
            </div>

            <div className="rounded-[16px] bg-[var(--bg)] p-3">
              {!project.rows.length ? (
                <div className="text-[13px] text-[var(--muted)]">
                  Upload een survey CSV in het hoofdvenster om te beginnen.
                </div>
              ) : (
                <div className="max-h-[calc(100vh-420px)] overflow-auto pr-1">
                  <QuestionSidebar
                    questions={project.questions}
                    selectedId={project.selectedQuestionId}
                    onSelect={(id) => {
                      selectQuestion(id);
                      setView("work");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      }
      header={
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[26px] font-medium tracking-tight">
              {project.rawCsvName ? project.name : "Survey werkruimte"}
            </div>

            {project.rawCsvName ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="rounded-full bg-white px-3 py-1.5 text-[12.5px] shadow-[var(--shadow-soft)]">
                  <span className="text-[var(--muted)]">Reacties</span>{" "}
                  <span className="font-medium">{project.rows.length}</span>
                </div>
                <div className="rounded-full bg-white px-3 py-1.5 text-[12.5px] shadow-[var(--shadow-soft)]">
                  <span className="text-[var(--muted)]">Vragen</span>{" "}
                  <span className="font-medium">{project.questions.length}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {project.rawCsvText ? (
              <CsvUploader
                config={project.parseConfig}
                compact
                onLoaded={({ name, text }) => {
                  loadCsv(name, text);
                  setView("work");
                }}
              />
            ) : null}
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {!project.rawCsvText ? (
          <div className="max-w-[820px] space-y-4 rounded-[18px] bg-white p-7 shadow-[var(--shadow)]">
            <h1 className="text-[22px] font-medium tracking-tight">
              Start met een survey-export
            </h1>
            <p className="text-[15px] leading-7 text-[var(--muted)]">
              Upload een CSV-export van je COMTOO UX survey — alles blijft lokaal in je browser.
            </p>
            <div className="pt-2">
              <CsvUploader
                config={project.parseConfig}
                onLoaded={({ name, text }) => {
                  loadCsv(name, text);
                  setView("work");
                }}
              />
            </div>
          </div>
        ) : view === "export" ? (
          <div className="rounded-[18px] bg-white p-7 shadow-[var(--shadow)]">
            <ExportPanel project={project} />
          </div>
        ) : view === "settings" ? (
          <div className="max-w-[760px] rounded-[18px] bg-white p-7 shadow-[var(--shadow)]">
            <div className="text-[18px] font-medium tracking-tight">Settings</div>
            <div className="mt-1 text-[13.5px] text-[var(--muted)]">
              Change parsing defaults if your CSV uses a different separator.
            </div>
            <div className="mt-5">
              <ParseSettingsPanel value={project.parseConfig} onChange={setParseConfig} />
            </div>
            {parseErrors.length ? (
              <div className="mt-4 rounded-[12px] bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
                Parsing warnings detected — adjust delimiter.
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[18px] bg-white p-7 shadow-[var(--shadow)]">
              {selected ? (
                <>
                  <div className="text-[12px] font-semibold tracking-[0.12em] text-[var(--faint)]">
                    VRAAG
                  </div>
                  <div className="mt-2 text-[20px] font-medium tracking-tight">
                    {tr(selected.label)}
                  </div>
                  <div className="mt-1 text-[13.5px] text-[var(--muted)]">
                    {selected.type === "open_text" ? "Open antwoorden." : "Gesloten vraag."}
                  </div>
                  {parseErrors.length ? (
                    <div className="mt-4 rounded-[12px] bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
                      <div className="font-medium">Parse-waarschuwingen</div>
                      <ul className="mt-1 list-disc pl-5">
                        {parseErrors.slice(0, 4).map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="mt-6">
                    {selected.type === "open_text" ? (
                      (() => {
                        const key = selected.columns[0]?.key;
                        const responses = key
                          ? project.rows.map((r) => (r[key] ?? "").trim()).filter(Boolean)
                          : [];
                        const maxShown = 200;
                        return (
                          <div className="space-y-3">
                            <div className="text-[12.5px] text-[var(--muted)]">
                              {responses.length} antwoorden
                              {responses.length > maxShown
                                ? ` (we tonen de eerste ${maxShown})`
                                : ""}
                              .
                            </div>
                            <div className="space-y-2">
                              {responses.slice(0, maxShown).map((t, i) => (
                                <div
                                  key={i}
                                  className="rounded-[12px] bg-[var(--bg)] p-3 text-[14px] leading-7"
                                >
                                  {t}
                                </div>
                              ))}
                              {!responses.length ? (
                                <div className="text-[13px] text-[var(--muted)]">
                                  Geen open antwoorden gevonden voor deze vraag.
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <QuantResultsPanel
                        question={{
                          ...selected,
                          label: tr(selected.label),
                        }}
                        rows={project.rows}
                        translateLabel={tr}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="text-[14px] text-[var(--muted)]">
                  Kies links een vraag om te beginnen.
                </div>
              )}
            </div>

            <details className="rounded-[18px] bg-white p-6 shadow-[var(--shadow)]">
              <summary className="cursor-pointer text-[13px] font-medium text-[var(--text)]">
                Data preview (eerste 5 rijen)
              </summary>
              <div className="mt-3">
                <CsvPreviewTable
                  headers={project.headers.slice(0, 10)}
                  rows={project.rows.slice(0, 5)}
                />
                {project.headers.length > 10 ? (
                  <div className="mt-2 text-[12.5px] text-[var(--muted)]">
                    Preview toont de eerste 10 kolommen voor leesbaarheid.
                  </div>
                ) : null}
              </div>
            </details>
          </div>
        )}
      </div>
    </AppShell>
  );
}
