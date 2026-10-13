import { FlaskConical, GitCompareArrows, TestTube } from "lucide-react";
import { Card, Badge, Skeleton } from "../ui";
import { timeAgo } from "../../utils";
import type { ActivityItem } from "../../types";

const typeConfig = {
  evaluation: {
    icon: FlaskConical,
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/60",
  },
  comparison: {
    icon: GitCompareArrows,
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/60",
  },
  test_case: {
    icon: TestTube,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
  },
};

const statusVariant = {
  pending: "warning" as const,
  running: "info" as const,
  completed: "success" as const,
  failed: "danger" as const,
};

interface Props {
  activities: ActivityItem[] | null;
  loading: boolean;
}

export function RecentActivity({ activities, loading }: Props) {
  if (loading || !activities) {
    return (
      <Card>
        <Skeleton className="h-5 w-36 mb-4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-3">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
          </div>
        ))}
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Recent Activity
      </h3>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {activities.map((item) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div
                className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.title}
                  </p>
                  {item.status && (
                    <Badge variant={statusVariant[item.status]}>
                      {item.status}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                  {item.description}
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                {timeAgo(item.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
