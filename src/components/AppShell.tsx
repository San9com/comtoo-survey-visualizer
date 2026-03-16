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
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-[320px_1fr] gap-10 px-10 py-10">
        <aside className="min-w-0">
          <div className="sticky top-10">
            <div className="rounded-[18px] bg-white shadow-[var(--shadow)]">
              {sidebar}
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="space-y-6">
            <header>{header}</header>
            <main>{children}</main>
          </div>
        </section>
      </div>
    </div>
  );
}

