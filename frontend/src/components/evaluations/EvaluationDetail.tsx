import { Card, Badge, ScoreBar } from "../ui";
import { formatLatency, severityColor } from "../../utils";
import type { Evaluation } from "../../types";

interface Props {
  evaluation: Evaluation;
}

export function EvaluationDetail({ evaluation }: Props) {
  if (evaluation.responses.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            {evaluation.status === "pending"
              ? "Evaluation is pending. Responses will appear here once processing begins."
              : evaluation.status === "running"
                ? "Evaluation is running..."
                : "No responses available."}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {evaluation.responses.map((response) => (
        <Card key={response.modelId} className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                {response.modelId === "gemini" ? "G" : "X"}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 capitalize">
                  {response.modelId}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatLatency(response.latencyMs)} · {response.tokenCount}{" "}
                  tokens
                </p>
              </div>
            </div>
            <Badge
              variant={
                response.scores.overall >= 0.8
                  ? "success"
                  : response.scores.overall >= 0.6
                    ? "warning"
                    : "danger"
              }
            >
              Score: {(response.scores.overall * 100).toFixed(0)}%
            </Badge>
          </div>

          {/* Response text */}
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-200 leading-relaxed border border-gray-100 dark:border-gray-800">
            {response.text}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ScoreBar label="Relevance" score={response.scores.relevance} />
            <ScoreBar label="Factuality" score={response.scores.factuality} />
            <ScoreBar label="Coherence" score={response.scores.coherence} />
            <ScoreBar
              label="Completeness"
              score={response.scores.completeness}
            />
            <ScoreBar
              label="Evidence Coverage"
              score={response.scores.evidenceCoverage}
            />
          </div>

          {/* Hallucination flags */}
          {response.hallucinations.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Hallucination Flags ({response.hallucinations.length})
              </h5>
              {response.hallucinations.map((h) => (
                <div
                  key={h.id}
                  className={`rounded-lg border px-3 py-2 text-sm ${severityColor(h.severity)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        h.severity === "high"
                          ? "danger"
                          : h.severity === "medium"
                            ? "warning"
                            : "success"
                      }
                    >
                      {h.severity}
                    </Badge>
                    <span className="font-medium">"{h.snippet}"</span>
                  </div>
                  <p className="text-xs opacity-80">{h.explanation}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
