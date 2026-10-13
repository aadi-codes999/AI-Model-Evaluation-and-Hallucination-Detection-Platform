import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, ScoreBar, Badge } from "../ui";
import type { Evaluation } from "../../types";

interface Props {
  evaluation: Evaluation;
}

export function ComparisonView({ evaluation }: Props) {
  const geminiResp = evaluation.responses.find((r) => r.modelId === "gemini");
  const grokResp = evaluation.responses.find((r) => r.modelId === "grok");

  if (!geminiResp || !grokResp) {
    return (
      <Card>
        <p className="text-sm text-gray-500 text-center py-8">
          This evaluation requires responses from both Gemini and Grok for
          comparison. Currently only has{" "}
          {evaluation.responses.map((r) => r.modelId).join(", ") || "none"}.
        </p>
      </Card>
    );
  }

  const radarData = [
    {
      metric: "Relevance",
      Gemini: +(geminiResp.scores.relevance * 100).toFixed(1),
      Grok: +(grokResp.scores.relevance * 100).toFixed(1),
    },
    {
      metric: "Factuality",
      Gemini: +(geminiResp.scores.factuality * 100).toFixed(1),
      Grok: +(grokResp.scores.factuality * 100).toFixed(1),
    },
    {
      metric: "Coherence",
      Gemini: +(geminiResp.scores.coherence * 100).toFixed(1),
      Grok: +(grokResp.scores.coherence * 100).toFixed(1),
    },
    {
      metric: "Completeness",
      Gemini: +(geminiResp.scores.completeness * 100).toFixed(1),
      Grok: +(grokResp.scores.completeness * 100).toFixed(1),
    },
    {
      metric: "Evidence",
      Gemini: +(geminiResp.scores.evidenceCoverage * 100).toFixed(1),
      Grok: +(grokResp.scores.evidenceCoverage * 100).toFixed(1),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Prompt */}
      <Card>
        <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/40 dark:to-purple-950/40 -m-6 p-6 rounded-xl border border-transparent dark:border-gray-800">
          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            Prompt
          </p>
          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
            {evaluation.prompt}
          </p>
        </div>
      </Card>

      {/* Radar chart */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Score Comparison
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="#64748b" strokeOpacity={0.25} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <Radar
                name="Gemini"
                dataKey="Gemini"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Radar
                name="Grok"
                dataKey="Grok"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                }}
                formatter={(v: any) => [`${v}%`]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Side by side responses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[geminiResp, grokResp].map((resp) => (
          <Card key={resp.modelId}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                  {resp.modelId === "gemini" ? "G" : "X"}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {resp.modelId}
                </h4>
              </div>
              <Badge
                variant={
                  resp.scores.overall >= 0.8
                    ? "success"
                    : resp.scores.overall >= 0.6
                      ? "warning"
                      : "danger"
                }
              >
                {(resp.scores.overall * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3 text-sm text-gray-700 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-gray-800 mb-4">
              {resp.text}
            </div>
            <div className="space-y-2">
              <ScoreBar label="Relevance" score={resp.scores.relevance} />
              <ScoreBar label="Factuality" score={resp.scores.factuality} />
              <ScoreBar
                label="Evidence Coverage"
                score={resp.scores.evidenceCoverage}
              />
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Latency: {resp.latencyMs}ms</span>
              <span>Tokens: {resp.tokenCount}</span>
              <span>
                Hallucinations:{" "}
                <span
                  className={
                    resp.hallucinations.length > 0
                      ? "text-red-500 font-medium"
                      : "text-emerald-600"
                  }
                >
                  {resp.hallucinations.length}
                </span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
