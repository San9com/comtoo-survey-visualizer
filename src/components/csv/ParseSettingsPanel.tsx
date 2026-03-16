import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ParseConfig, ParseDelimiter } from "@/lib/types";

export function ParseSettingsPanel({
  value,
  onChange,
  onConfirm,
}: {
  value: ParseConfig;
  onChange: (next: ParseConfig) => void;
  onConfirm?: () => void;
}) {
  const setDelimiter = (d: ParseDelimiter) => onChange({ ...value, delimiter: d });

  return (
    <div className="space-y-3">
      <div className="text-[12px] font-semibold tracking-[0.12em] text-[var(--faint)]">
        PARSING
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="subtle"
          className={value.delimiter === ";" ? "border-[rgba(124,199,255,0.6)]" : ""}
          onClick={() => setDelimiter(";")}
        >
          Semicolon
        </Button>
        <Button
          variant="subtle"
          className={value.delimiter === "," ? "border-[rgba(124,199,255,0.6)]" : ""}
          onClick={() => setDelimiter(",")}
        >
          Comma
        </Button>
        <Button
          variant="subtle"
          className={value.delimiter === "\t" ? "border-[rgba(124,199,255,0.6)]" : ""}
          onClick={() => setDelimiter("\t")}
        >
          Tab
        </Button>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
        <div>
          <div className="text-[13px] font-medium">Header row</div>
          <div className="text-[12px] text-[var(--muted)]">
            First row contains question labels / column names
          </div>
        </div>
        <input
          type="checkbox"
          checked={value.hasHeaderRow}
          onChange={(e) => onChange({ ...value, hasHeaderRow: e.target.checked })}
        />
      </label>

      <label className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] px-3 py-2">
        <div>
          <div className="text-[13px] font-medium">Skip empty lines</div>
          <div className="text-[12px] text-[var(--muted)]">
            Ignore blank rows in the export
          </div>
        </div>
        <input
          type="checkbox"
          checked={value.skipEmptyLines}
          onChange={(e) => onChange({ ...value, skipEmptyLines: e.target.checked })}
        />
      </label>

      <div className="hidden">
        {/* Reserved for future options (encoding, quote mode, etc.). */}
        <Input readOnly value="" />
      </div>

      {onConfirm ? (
        <div className="pt-1">
          <Button onClick={onConfirm} className="w-full">
            Use these settings
          </Button>
        </div>
      ) : null}
    </div>
  );
}

