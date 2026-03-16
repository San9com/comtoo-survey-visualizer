import { Icon } from "@/components/ui/Icon";

export function SidebarNav({
  current,
  onSelect,
}: {
  current: "work" | "export" | "settings";
  onSelect: (v: "work" | "export" | "settings") => void;
}) {
  const item = (
    id: "work" | "export" | "settings",
    label: string,
    icon: Parameters<typeof Icon>[0]["name"],
  ) => {
    const active = current === id;
    return (
      <button
        type="button"
        onClick={() => onSelect(id)}
        className={[
          "flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-left transition",
          active ? "bg-[rgba(124,199,255,0.14)]" : "hover:bg-black/[0.03]",
        ].join(" ")}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={[
              "grid h-9 w-9 place-items-center rounded-[12px]",
              active ? "bg-white shadow-[var(--shadow-soft)]" : "bg-white/60",
            ].join(" ")}
          >
            <span className={active ? "text-[var(--accent-ink)]" : "text-[var(--muted)]"}>
              <Icon name={icon} className="h-4.5 w-4.5" />
            </span>
          </div>
          <div>
            <div className="text-[13.5px] font-medium text-[var(--text)]">
              {label}
            </div>
            <div className="text-[12px] text-[var(--muted)]">
              {id === "work"
                ? "Charts and AI synthesis"
                : id === "export"
                  ? "Markdown and JSON"
                  : "Parsing defaults"}
            </div>
          </div>
        </div>
        <span className="text-[var(--faint)]">
          <Icon name="chevron" className="h-4 w-4" />
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-1">
      {item("work", "Workspace", "workspace")}
      {item("export", "Export", "export")}
      {item("settings", "Settings", "settings")}
    </div>
  );
}

