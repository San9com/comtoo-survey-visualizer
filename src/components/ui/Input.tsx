import * as React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-9 w-full rounded-[10px] border border-black/[0.08] bg-[var(--panel)] px-3 shadow-[0_1px_0_rgba(15,23,42,0.03)]",
        "text-[14px] text-[var(--text)] placeholder:text-[var(--faint)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

