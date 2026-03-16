import type { Question, QuestionType } from "@/lib/types";

const TYPE_LABEL: Record<QuestionType, string> = {
  metadata: "Metadata",
  single_choice: "Single choice",
  multiple_choice: "Multiple choice",
  yes_no: "Yes/No",
  rating: "Rating",
  open_text: "Open text",
};

function groupByType(questions: Question[]) {
  const groups = new Map<QuestionType, Question[]>();
  for (const q of questions) {
    const list = groups.get(q.type) ?? [];
    list.push(q);
    groups.set(q.type, list);
  }
  return groups;
}

export function QuestionSidebar({
  questions,
  selectedId,
  onSelect,
}: {
  questions: Question[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const groups = groupByType(questions);
  const order: QuestionType[] = [
    "rating",
    "yes_no",
    "single_choice",
    "multiple_choice",
    "open_text",
    "metadata",
  ];

  return (
    <div className="space-y-4">
      {order
        .filter((t) => (groups.get(t)?.length ?? 0) > 0)
        .map((t) => {
          const items = groups.get(t)!;
          return (
            <div key={t} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-[12px] font-semibold tracking-[0.12em] text-[var(--faint)]">
                  {TYPE_LABEL[t].toUpperCase()}
                </div>
                <div className="text-[12px] text-[var(--faint)]">
                  {items.length}
                </div>
              </div>
              <div className="space-y-1">
                {items.map((q) => {
                  const active = q.id === selectedId;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onSelect(q.id)}
                      className={[
                        "w-full rounded-[10px] px-3 py-2 text-left transition",
                        active
                          ? "bg-[rgba(124,199,255,0.14)]"
                          : "bg-transparent hover:bg-black/[0.03]",
                      ].join(" ")}
                    >
                      <div className="text-[13px] font-medium leading-5">
                        {q.label}
                      </div>
                      <div className="mt-0.5 text-[12px] text-[var(--muted)]">
                        {TYPE_LABEL[q.type]}
                        {q.type === "multiple_choice"
                          ? ` · ${q.columns.length} options`
                          : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

