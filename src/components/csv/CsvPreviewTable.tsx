export function CsvPreviewTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Record<string, string>[];
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)]">
      <div className="overflow-auto">
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead className="sticky top-0 bg-white">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap border-b border-[var(--border)] px-3 py-2 font-semibold text-[var(--muted)]"
                >
                  {h || <span className="text-[var(--faint)]">(empty)</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="odd:bg-[var(--bg)]">
                {headers.map((h) => (
                  <td
                    key={`${idx}-${h}`}
                    className="max-w-[320px] truncate border-b border-[var(--border)] px-3 py-2 text-[var(--text)]"
                    title={r[h] ?? ""}
                  >
                    {r[h] ?? ""}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td
                  className="px-3 py-6 text-center text-[13px] text-[var(--muted)]"
                  colSpan={headers.length || 1}
                >
                  No rows parsed.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

