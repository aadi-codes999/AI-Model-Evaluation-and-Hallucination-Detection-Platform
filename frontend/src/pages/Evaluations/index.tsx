import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { EvaluationForm } from "../../components/evaluations/EvaluationForm";
import { EvaluationDetail } from "../../components/evaluations/EvaluationDetail";
import { EvaluationHistory } from "../../components/evaluations/EvaluationHistory";
import { EmptyState } from "../../components/ui";
import { FlaskConical } from "lucide-react";
import { useAsync } from "../../hooks";
import { api } from "../../services/api";
import type { ModelId, EvaluationCriteria, Evaluation } from "../../types";

export default function EvaluationsPage() {
  const { data: evaluations, loading, refetch } = useAsync(
    () => api.getEvaluations(),
    []
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localEvals, setLocalEvals] = useState<Evaluation[]>([]);

  const allEvals = [...(localEvals ?? []), ...(evaluations ?? [])];

  const selected = allEvals.find((e) => e.id === selectedId);

  async function handleSubmit(data: {
    prompt: string;
    context?: string;
    models: ModelId[];
    criteria: EvaluationCriteria;
  }) {
    setSubmitting(true);
    try {
      const result = await api.createEvaluation(data);
      setLocalEvals((prev) => [result, ...prev]);
      setSelectedId(result.id);
      await refetch();
    } catch {
      // Error is handled silently in demo mode
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Header
        title="Evaluations"
        subtitle="Create and review model evaluations"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Form + Detail */}
        <div className="xl:col-span-2 space-y-6">
          <EvaluationForm onSubmit={handleSubmit} loading={submitting} />

          {selected ? (
            <div className="space-y-3">
              <div className="bg-gray-50 dark:bg-gray-850 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">Prompt</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                  {selected.prompt}
                </p>
              </div>
              <EvaluationDetail evaluation={selected} />
            </div>
          ) : allEvals.length > 0 ? (
            <EmptyState
              icon={<FlaskConical className="w-7 h-7" />}
              title="Select an Evaluation"
              description="Choose an evaluation from the history panel to see details."
            />
          ) : !loading ? (
            <EmptyState
              icon={<FlaskConical className="w-7 h-7" />}
              title="No Evaluations Yet"
              description="Create your first evaluation using the form above."
            />
          ) : null}
        </div>

        {/* Right: History */}
        <div>
          {allEvals.length > 0 && (
            <EvaluationHistory
              evaluations={allEvals}
              selectedId={selectedId ?? undefined}
              onSelect={setSelectedId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
