import * as React from "react";

export function TagChip({
  label,
  selected,
  onClick,
  tone = "neutral",
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  tone?: "neutral" | "accent";
}) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] leading-none transition select-none";

  const styles =
    tone === "accent"
      ? selected
        ? "bg-[rgba(124,199,255,0.18)] border-[rgba(124,199,255,0.45)] text-[var(--accent-ink)]"
        : "bg-white border-[var(--border)] text-[var(--muted)] hover:bg-black/[0.02]"
      : selected
        ? "bg-black/[0.04] border-[var(--border)] text-[var(--text)]"
        : "bg-white border-[var(--border)] text-[var(--muted)] hover:bg-black/[0.02]";

  const Comp = onClick ? "button" : "span";

  return (
    <Comp
      onClick={onClick}
      className={`${base} ${styles}`}
      {...(onClick ? { type: "button" as const } : {})}
    >
      {label}
    </Comp>
  );
}

