import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { ComparisonView } from "../../components/model-comparison/ComparisonView";
import { Card, EmptyState, Select } from "../../components/ui";
import { GitCompareArrows } from "lucide-react";
import { useAsync } from "../../hooks";
import { api } from "../../services/api";

export default function ModelComparisonPage() {
  const { data: evaluations, loading } = useAsync(
    () => api.getEvaluations(),
    []
  );

  // Only evaluations that have both models
  const comparableEvals = (evaluations ?? []).filter(
    (e) =>
      e.status === "completed" &&
      e.models.includes("gemini") &&
      e.models.includes("grok") &&
      e.responses.length >= 2
  );

  const [selectedId, setSelectedId] = useState<string>("");
  const selected =
    comparableEvals.find((e) => e.id === selectedId) ??
    comparableEvals[0] ??
    null;

  return (
    <div className="space-y-6">
      <Header
        title="Model Comparison"
        subtitle="Compare Gemini and Grok responses side by side"
      />

      {loading ? (
        <Card>
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-48 bg-gray-100 rounded" />
            <div className="h-64 bg-gray-50 rounded-lg" />
          </div>
        </Card>
      ) : comparableEvals.length === 0 ? (
        <EmptyState
          icon={<GitCompareArrows className="w-7 h-7" />}
          title="No Comparisons Available"
          description="Run an evaluation with both Gemini and Grok selected to see a side-by-side comparison."
        />
      ) : (
        <>
          <Card padding="sm">
            <div className="px-2 py-1">
              <Select
                label="Select Evaluation"
                value={selectedId || (selected?.id ?? "")}
                onChange={(e) => setSelectedId(e.target.value)}
                options={comparableEvals.map((e) => ({
                  value: e.id,
                  label: `${e.prompt.slice(0, 80)}${e.prompt.length > 80 ? "..." : ""}`,
                }))}
              />
            </div>
          </Card>

          {selected && <ComparisonView evaluation={selected} />}
        </>
      )}
    </div>
  );
}
