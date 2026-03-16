import * as React from "react";
import { Button } from "@/components/ui/Button";
import type { ParseConfig } from "@/lib/types";

export function CsvUploader({
  onLoaded,
  config,
  hint,
  compact,
}: {
  config: ParseConfig;
  hint?: string;
  compact?: boolean;
  onLoaded: (payload: { name: string; text: string; config: ParseConfig }) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function loadFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const text = await file.text();
      onLoaded({ name: file.name, text, config });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void loadFile(f);
        }}
      />

      <div className="flex items-center gap-2">
        <Button
          variant="subtle"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Reading…" : "Upload CSV"}
        </Button>
        {!compact ? (
          <div className="text-[12.5px] text-[var(--muted)]">
            {hint ?? "Supports semicolon-separated exports (common in NL)."}
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-[var(--radius-sm)] border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-800">
          {error}
        </div>
      ) : null}
    </div>
  );
}

