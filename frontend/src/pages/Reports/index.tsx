import { useState, useMemo } from "react";
import { Header } from "../../components/layout/Header";
import {
  Card,
  Button,
  Badge,
  Select,
  EmptyState,
} from "../../components/ui";
import {
  Download,
  FileBarChart,
  TrendingUp,
  AlertTriangle,
  Award,
  Zap,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { useAsync } from "../../hooks";
import { api } from "../../services/api";
import { downloadFile, formatPercent } from "../../utils";

export default function ReportsPage() {
  const { data: rawReportData, loading: reportsLoading } = useAsync(
    () => api.getReportData(),
    []
  );
  const { data: modelPerf, loading: perfLoading } = useAsync(
    () => api.getModelPerformance(),
    []
  );
  const [timeRange, setTimeRange] = useState<string>("30");

  const data = useMemo(() => {
    if (!rawReportData) return [];
    const count = parseInt(timeRange, 10) || 30;
    return rawReportData.slice(-count);
  }, [rawReportData, timeRange]);

  // Derived metrics
  const stats = useMemo(() => {
    if (!data.length) return null;
    const totalEvals = data.reduce((acc, curr) => acc + curr.evaluations, 0);
    const avgScore =
      data.reduce((acc, curr) => acc + curr.avgScore, 0) / data.length;
    const avgHallucination =
      data.reduce((acc, curr) => acc + curr.hallucinationRate, 0) / data.length;

    return {
      totalEvals,
      avgScore,
      avgHallucination,
      topModel: "Gemini 1.5 Pro",
    };
  }, [data]);

  // Model comparison summary table rows
  const modelComparisonRows = [
    { metric: "Overall Benchmark Score", gemini: "88.4%", grok: "82.6%", winner: "Gemini" },
    { metric: "Factual Accuracy", gemini: "89.1%", grok: "81.4%", winner: "Gemini" },
    { metric: "Relevance & Alignment", gemini: "91.2%", grok: "88.7%", winner: "Gemini" },
    { metric: "Evidence Coverage", gemini: "84.5%", grok: "76.0%", winner: "Gemini" },
    { metric: "Completeness", gemini: "79.8%", grok: "83.2%", winner: "Grok" },
    { metric: "Hallucination Rate (Lower is better)", gemini: "5.2%", grok: "8.6%", winner: "Gemini" },
    { metric: "Average Latency", gemini: "1.12s", grok: "0.89s", winner: "Grok" },
  ];

  function handleExportCSV() {
    if (!data.length) return;
    const headers = "Date,Evaluations,Average_Score,Hallucination_Rate\n";
    const rows = data
      .map(
        (r) =>
          `${r.date},${r.evaluations},${(r.avgScore * 100).toFixed(1)}%,${(
            r.hallucinationRate * 100
          ).toFixed(1)}%`
      )
      .join("\n");
    downloadFile(headers + rows, `evalora-report-last-${timeRange}d.csv`, "text/csv");
  }

  function handleExportJSON() {
    if (!data.length) return;
    const jsonStr = JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        timeRangeDays: timeRange,
        summary: stats,
        dailyMetrics: data,
        modelComparison: modelComparisonRows,
      },
      null,
      2
    );
    downloadFile(
      jsonStr,
      `evalora-report-last-${timeRange}d.json`,
      "application/json"
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Reports & Analytics"
        subtitle="Historical trends, hallucination incidence, and model verification statistics"
        actions={
          <div className="flex items-center gap-2">
            <div className="w-36">
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                options={[
                  { value: "7", label: "Last 7 Days" },
                  { value: "14", label: "Last 14 Days" },
                  { value: "30", label: "Last 30 Days" },
                ]}
              />
            </div>
            <Button
              variant="secondary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="ghost"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportJSON}
            >
              JSON
            </Button>
          </div>
        }
      />

      {reportsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-100 rounded" />
            </Card>
          ))}
        </div>
      ) : !stats ? (
        <EmptyState
          icon={<FileBarChart className="w-8 h-8" />}
          title="No Report Data"
          description="There is no analytics data available for the chosen time range."
        />
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="md" hover>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Evaluations
                </span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {stats.totalEvals.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600 font-medium">
                  +{data.length} periods
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Across Gemini & Grok</p>
            </Card>

            <Card padding="md" hover>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Average Quality Score
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPercent(stats.avgScore)}
                </span>
                <Badge variant="success">High Accuracy</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Synthesized across all criteria
              </p>
            </Card>

            <Card padding="md" hover>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Hallucination Rate
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-amber-600">
                  {formatPercent(stats.avgHallucination)}
                </span>
                <Badge variant="warning">Monitored</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Factual discrepancies flagged
              </p>
            </Card>

            <Card padding="md" hover>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Top Performing Model
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {stats.topModel}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Leading in factuality & evidence
              </p>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart: Evaluations & Quality Score */}
            <Card padding="md">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Evaluation Volume & Average Score
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daily evaluation count and quality scores over time
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(d: string) => d.slice(5)}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      domain={[0, "auto"]}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 1]}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      labelFormatter={(d: any) =>
                        new Date(String(d)).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      formatter={(v: any, name: any) => [
                        name === "Score" ? `${(Number(v) * 100).toFixed(1)}%` : v,
                        name,
                      ]}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgScore"
                      name="Score"
                      stroke="#6366f1"
                      fill="url(#scoreGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="evaluations"
                      name="Evaluations"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Hallucination Rate Trend */}
            <Card padding="md">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Hallucination Detection Rate Trend
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Proportion of model outputs flagged with factual inconsistencies
                </p>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient
                        id="hallucinationGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(d: string) => d.slice(5)}
                    />
                    <YAxis
                      domain={[0, 0.4]}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      labelFormatter={(d: any) =>
                        new Date(String(d)).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      formatter={(v: any) => [`${(Number(v) * 100).toFixed(1)}%`, "Hallucination Rate"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="hallucinationRate"
                      name="Hallucination Rate"
                      stroke="#f59e0b"
                      fill="url(#hallucinationGrad)"
                      strokeWidth={2}
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Model Comparison Breakdown & Bar Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Criteria Breakdown Bar Chart */}
            <Card padding="md">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  Model Dimension Comparison
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Gemini 1.5 Pro vs Grok-2 performance across key criteria
                </p>
              </div>
              <div className="h-64">
                {perfLoading ? (
                  <div className="h-full bg-gray-50 rounded-lg animate-pulse" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        modelPerf?.map((p) => ({
                          ...p,
                          geminiPct: +(p.gemini * 100).toFixed(0),
                          grokPct: +(p.grok * 100).toFixed(0),
                        })) ?? []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "#94a3b8" }}
                        tickFormatter={(v: number) => `${v}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                        formatter={(v: any) => [`${v}%`]}
                      />
                      <Legend />
                      <Bar
                        dataKey="geminiPct"
                        name="Gemini 1.5 Pro"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="grokPct"
                        name="Grok-2"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Card>

            {/* Severity Distribution & Quick Insights */}
            <Card padding="md" className="flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Verification & Safety Insights
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 mb-4">
                  Distribution of flagged issues and severity classes
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-sm font-medium text-emerald-950 dark:text-emerald-200">
                          Low Severity Inconsistencies
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400">
                          Minor wording ambiguity or non-critical details
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      58%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-amber-950 dark:text-amber-200">
                          Medium Severity Inconsistencies
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Unverified numerical claims or date inaccuracies
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                      32%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-100 dark:border-red-900/60">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-medium text-red-950 dark:text-red-200">
                          High Severity Hallucinations
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-400">
                          Completely fabricated entities, citations, or facts
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-red-800 dark:text-red-300">
                      10%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-500" />
                  Auto-flagged via NLI + Ground Truth checking
                </span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  34 total flags
                </span>
              </div>
            </Card>
          </div>

          {/* Model Comparison Table */}
          <Card padding="md">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Comprehensive Model Comparison Matrix
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Head-to-head performance across all evaluated metrics
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Gemini 1.5 Pro</th>
                    <th className="py-3 px-4">Grok-2</th>
                    <th className="py-3 px-4">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {modelComparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                        {row.metric}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {row.gemini}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                          {row.grok}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={row.winner === "Gemini" ? "info" : "purple"}
                        >
                          {row.winner}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
