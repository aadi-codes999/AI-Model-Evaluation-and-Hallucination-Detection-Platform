import { useState, type FormEvent } from "react";
import {
  Button,
  TextArea,
  Input,
  Card,
} from "../ui";
import type { ModelId, EvaluationCriteria } from "../../types";
import { cn } from "../../utils";

interface Props {
  onSubmit: (data: {
    prompt: string;
    context?: string;
    models: ModelId[];
    criteria: EvaluationCriteria;
  }) => void;
  loading?: boolean;
}

const modelOptions: { id: ModelId; name: string; provider: string }[] = [
  { id: "gemini", name: "Gemini", provider: "Google" },
  { id: "grok", name: "Grok", provider: "xAI" },
];

const criteriaOptions: { key: keyof EvaluationCriteria; label: string }[] = [
  { key: "relevance", label: "Relevance" },
  { key: "factuality", label: "Factuality" },
  { key: "coherence", label: "Coherence" },
  { key: "completeness", label: "Completeness" },
  { key: "evidenceCoverage", label: "Evidence Coverage" },
];

export function EvaluationForm({ onSubmit, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [models, setModels] = useState<ModelId[]>(["gemini", "grok"]);
  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    relevance: true,
    factuality: true,
    coherence: true,
    completeness: true,
    evidenceCoverage: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleModel(id: ModelId) {
    setModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  function toggleCriteria(key: keyof EvaluationCriteria) {
    setCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!prompt.trim()) newErrors.prompt = "Prompt is required";
    if (models.length === 0) newErrors.models = "Select at least one model";
    if (!Object.values(criteria).some(Boolean))
      newErrors.criteria = "Select at least one criterion";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      prompt: prompt.trim(),
      context: context.trim() || undefined,
      models,
      criteria,
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            New Evaluation
          </h3>

          <TextArea
            label="Prompt"
            placeholder="Enter the prompt to evaluate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            error={errors.prompt}
            rows={4}
          />
        </div>

        <Input
          label="Context (optional)"
          placeholder="Additional context or instructions..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />

        {/* Model selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Models
          </label>
          <div className="flex flex-wrap gap-3">
            {modelOptions.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleModel(m.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer",
                  models.includes(m.id)
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    models.includes(m.id) ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"
                  )}
                />
                {m.name}
                <span className="text-xs opacity-60">{m.provider}</span>
              </button>
            ))}
          </div>
          {errors.models && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.models}</p>
          )}
        </div>

        {/* Criteria */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Evaluation Criteria
          </label>
          <div className="flex flex-wrap gap-2">
            {criteriaOptions.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleCriteria(c.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer",
                  criteria[c.key]
                    ? "border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          {errors.criteria && (
            <p className="text-xs text-red-500 dark:text-red-400">{errors.criteria}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            Run Evaluation
          </Button>
        </div>
      </form>
    </Card>
  );
}
