import {
  TrendingUp,
  TrendingDown,
  FlaskConical,
  Star,
  Cpu,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card, Skeleton } from "../ui";
import { cn } from "../../utils";
import type { DashboardStats } from "../../types";

interface StatCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {value}
          </p>
          {trend !== undefined && (
            <div
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5",
                trend >= 0
                  ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : "text-red-700 bg-red-50 dark:bg-red-950/60 dark:text-red-400"
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center",
            iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>
      </div>
      {/* Decorative gradient */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-[0.07] bg-gradient-to-br from-indigo-500 to-purple-500" />
    </Card>
  );
}

interface StatsGridProps {
  stats: DashboardStats | null;
  loading: boolean;
}

export function StatsGrid({ stats, loading }: StatsGridProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-4 w-28 mb-3" />
            <Skeleton className="h-9 w-20 mb-2" />
            <Skeleton className="h-5 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total Evaluations"
        value={stats.totalEvaluations.toLocaleString()}
        trend={stats.evaluationsTrend}
        icon={FlaskConical}
        iconColor="text-indigo-600 dark:text-indigo-400"
        iconBg="bg-indigo-50 dark:bg-indigo-950/60"
      />
      <StatCard
        title="Average Score"
        value={`${(stats.avgScore * 100).toFixed(0)}%`}
        trend={stats.scoreTrend}
        icon={Star}
        iconColor="text-amber-600 dark:text-amber-400"
        iconBg="bg-amber-50 dark:bg-amber-950/60"
      />
      <StatCard
        title="Models Active"
        value={stats.modelsActive.toString()}
        icon={Cpu}
        iconColor="text-purple-600 dark:text-purple-400"
        iconBg="bg-purple-50 dark:bg-purple-950/60"
      />
      <StatCard
        title="Hallucinations Found"
        value={stats.hallucinationsDetected.toLocaleString()}
        icon={AlertTriangle}
        iconColor="text-red-500 dark:text-red-400"
        iconBg="bg-red-50 dark:bg-red-950/60"
      />
    </div>
  );
}
