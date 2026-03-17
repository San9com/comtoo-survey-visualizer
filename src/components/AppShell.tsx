import * as React from "react";

export function AppShell({
  sidebar,
  header,
  children,
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto grid h-full w-full max-w-[1400px] grid-cols-[320px_1fr] gap-10 px-10 py-8">
        <aside className="min-w-0">
          <div className="sticky top-8 max-h-[calc(100vh-64px)]">
            <div className="max-h-[calc(100vh-64px)] overflow-hidden rounded-[18px] border border-black/[0.06] bg-[var(--panel)] shadow-[var(--shadow)]">
              {sidebar}
            </div>
          </div>
        </aside>

        <section className="min-w-0 overflow-auto">
          <div className="space-y-6 pb-8">
            <header>{header}</header>
            <main>{children}</main>
          </div>
        </section>
      </div>
    </div>
  );
}

