import { Card, Badge } from "../ui";
import { formatDate } from "../../utils";
import type { Evaluation } from "../../types";

const statusVariant = {
  pending: "warning" as const,
  running: "info" as const,
  completed: "success" as const,
  failed: "danger" as const,
};

interface Props {
  evaluations: Evaluation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function EvaluationHistory({
  evaluations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <Card padding="sm">
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 px-2 py-2">
        Evaluation History
      </h3>
      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {evaluations.map((ev) => (
          <button
            key={ev.id}
            onClick={() => onSelect(ev.id)}
            className={`w-full text-left px-3 py-3 rounded-xl transition-all cursor-pointer ${
              selectedId === ev.id
                ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 border border-indigo-100 dark:border-indigo-900"
                : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                {ev.prompt}
              </p>
              <Badge variant={statusVariant[ev.status]}>{ev.status}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(ev.createdAt)}</span>
              <span>·</span>
              <span>
                {ev.models.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
              </span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
