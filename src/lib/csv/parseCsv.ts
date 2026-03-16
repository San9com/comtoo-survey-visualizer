import Papa from "papaparse";
import type { ParseConfig } from "@/lib/types";

export type ParsedCsv = {
  headers: string[];
  rows: Record<string, string>[];
  previewRows: Record<string, string>[];
  errors: string[];
};

export function parseCsv(text: string, config: ParseConfig): ParsedCsv {
  const errors: string[] = [];

  const result = Papa.parse<Record<string, unknown>>(text, {
    delimiter: config.delimiter,
    header: config.hasHeaderRow,
    skipEmptyLines: config.skipEmptyLines ? "greedy" : false,
    dynamicTyping: false,
    quoteChar: '"',
    escapeChar: '"',
    transformHeader: (h) => (h ?? "").trim(),
  });

  if (result.errors?.length) {
    for (const e of result.errors) {
      errors.push(`${e.type}${e.code ? ` (${e.code})` : ""}: ${e.message}`);
    }
  }

  // Papa returns row objects when header=true; otherwise arrays.
  if (!config.hasHeaderRow) {
    // Local-first UX: we still support it, but we need generated headers.
    const data = result.data as unknown as string[][];
    const maxLen = data.reduce((m, r) => Math.max(m, r.length), 0);
    const headers = Array.from({ length: maxLen }, (_, i) => `Column ${i + 1}`);

    const rows = data
      .filter((r) => r.some((c) => `${c ?? ""}`.trim() !== ""))
      .map((r) => {
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = `${r[i] ?? ""}`.trim();
        });
        return obj;
      });

    return {
      headers,
      rows,
      previewRows: rows.slice(0, 5),
      errors,
    };
  }

  const rows = (result.data ?? []).map((row) => {
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(row ?? {})) {
      const key = (k ?? "").trim();
      if (!key) continue;
      clean[key] = `${v ?? ""}`.trim();
    }
    return clean;
  });

  const headers =
    result.meta?.fields?.map((h) => (h ?? "").trim()).filter(Boolean) ??
    Array.from(
      new Set(rows.flatMap((r) => Object.keys(r))),
    );

  return {
    headers,
    rows,
    previewRows: rows.slice(0, 5),
    errors,
  };
}

