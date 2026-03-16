export function Icon({
  name,
  className = "h-4 w-4",
}: {
  name:
    | "home"
    | "workspace"
    | "export"
    | "settings"
    | "upload"
    | "sparkles"
    | "chevron";
  className?: string;
}) {
  const common = { className, "aria-hidden": true } as const;
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 19.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 21v-7A1.5 1.5 0 0 1 11 12.5h2A1.5 1.5 0 0 1 14.5 14v7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "workspace":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M8 9h8M8 12h8M8 15h5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "export":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="M12 3v10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8.5 6.5 12 3l3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9A2.5 2.5 0 0 0 19 17.5v-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M19.4 13a7.9 7.9 0 0 0 0-2l2-1.2-2-3.5-2.3.6a8 8 0 0 0-1.7-1l-.3-2.4H9l-.3 2.4a8 8 0 0 0-1.7 1l-2.3-.6-2 3.5 2 1.2a7.9 7.9 0 0 0 0 2l-2 1.2 2 3.5 2.3-.6a8 8 0 0 0 1.7 1l.3 2.4h6.1l.3-2.4a8 8 0 0 0 1.7-1l2.3.6 2-3.5-2-1.2Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="M12 16V3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M8 7l4-4 4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M4 16.5v2A2.5 2.5 0 0 0 6.5 21h11A2.5 2.5 0 0 0 20 18.5v-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="M12 2l1.2 4.4L17.5 8l-4.3 1.6L12 14l-1.2-4.4L6.5 8l4.3-1.6L12 2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M19 13l.7 2.2L22 16l-2.3.8L19 19l-.7-2.2L16 16l2.3-.8L19 13Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      );
    case "chevron":
      return (
        <svg viewBox="0 0 24 24" fill="none" {...common}>
          <path
            d="m9 6 6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

