import * as React from "react";

type ButtonVariant = "primary" | "ghost" | "subtle" | "danger";
type ButtonSize = "sm" | "md";

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none " +
    "rounded-[10px] border text-[14px] font-medium leading-none transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)] " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3",
    md: "h-9 px-3.5",
  };

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[var(--text)] text-white border-transparent hover:bg-black/90",
    ghost:
      "bg-transparent text-[var(--text)] border-transparent hover:bg-black/[0.04]",
    subtle:
      "bg-white text-[var(--text)] border-[var(--border)] hover:bg-black/[0.02] shadow-[0_1px_0_rgba(15,23,42,0.03)]",
    danger:
      "bg-white text-red-700 border-red-200 hover:bg-red-50 hover:border-red-300",
  };

  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

