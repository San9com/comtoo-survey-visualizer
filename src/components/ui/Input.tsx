import * as React from "react";

export function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={[
        "h-9 w-full rounded-[10px] border border-[var(--border)] bg-white px-3",
        "text-[14px] text-[var(--text)] placeholder:text-[var(--faint)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]",
        className,
      ].join(" ")}
      {...props}
    />
  );
}

