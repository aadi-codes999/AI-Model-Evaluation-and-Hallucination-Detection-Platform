import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Card, Skeleton } from "../ui";
import type { TrendDataPoint, ModelPerformancePoint } from "../../types";

interface TrendsChartProps {
  data: TrendDataPoint[] | null;
  loading: boolean;
}

export function TrendsChart({ data, loading }: TrendsChartProps) {
  if (loading || !data) {
    return (
      <Card>
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Evaluation Trends
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickFormatter={(d: string) =>
                new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })
              }
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 1]}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
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
                  month: "long",
                  day: "numeric",
                })
              }
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="evaluations"
              stroke="#6366f1"
              fill="url(#evalGrad)"
              strokeWidth={2}
              name="Evaluations"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="avgScore"
              stroke="#8b5cf6"
              fill="url(#scoreGrad)"
              strokeWidth={2}
              name="Avg Score"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

interface ModelChartProps {
  data: ModelPerformancePoint[] | null;
  loading: boolean;
}

export function ModelBarChart({ data, loading }: ModelChartProps) {
  if (loading || !data) {
    return (
      <Card>
        <Skeleton className="h-5 w-44 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    gemini: +(d.gemini * 100).toFixed(1),
    grok: +(d.grok * 100).toFixed(1),
  }));

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Model Performance
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
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
              dataKey="gemini"
              name="Gemini"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="grok"
              name="Grok"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function ModelRadarChart({ data, loading }: ModelChartProps) {
  if (loading || !data) {
    return (
      <Card>
        <Skeleton className="h-5 w-36 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    gemini: +(d.gemini * 100).toFixed(1),
    grok: +(d.grok * 100).toFixed(1),
  }));

  return (
    <Card>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Capability Radar
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <Radar
              name="Gemini"
              dataKey="gemini"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Grok"
              dataKey="grok"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Legend />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(v: any) => [`${v}%`]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
