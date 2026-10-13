import { useState, type FormEvent } from "react";
import {
  Button,
  Input,
  TextArea,
  Select,
  Modal,
  Card,
} from "../ui";
import type { TestCase, TestCaseCategory } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<TestCase, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: TestCase;
  loading?: boolean;
}

const categoryOptions: { value: TestCaseCategory; label: string }[] = [
  { value: "factual", label: "Factual" },
  { value: "reasoning", label: "Reasoning" },
  { value: "creative", label: "Creative" },
  { value: "technical", label: "Technical" },
  { value: "general", label: "General" },
];

export function TestCaseModal({
  open,
  onClose,
  onSave,
  initialData,
  loading,
}: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [prompt, setPrompt] = useState(initialData?.prompt ?? "");
  const [expectedOutput, setExpectedOutput] = useState(
    initialData?.expectedOutput ?? ""
  );
  const [category, setCategory] = useState<TestCaseCategory>(
    initialData?.category ?? "general"
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags.join(", ") ?? ""
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!prompt.trim()) errs.prompt = "Prompt is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      prompt: prompt.trim(),
      expectedOutput: expectedOutput.trim() || undefined,
      category,
      tags,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Edit Test Case" : "Add Test Case"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Test case name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <TextArea
          label="Prompt"
          placeholder="The prompt to test..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          error={errors.prompt}
          rows={3}
        />
        <TextArea
          label="Expected Output (optional)"
          placeholder="What the ideal response should include..."
          value={expectedOutput}
          onChange={(e) => setExpectedOutput(e.target.value)}
          rows={2}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as TestCaseCategory)
            }
            options={categoryOptions}
          />
          <Input
            label="Tags (comma-separated)"
            placeholder="physics, science"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {initialData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ── Import/Export ────────────────────────────────────────────────────

interface ImportExportProps {
  testCases: TestCase[];
  onImport: (cases: TestCase[]) => void;
}

export function ImportExportCard({ testCases, onImport }: ImportExportProps) {
  function handleExport() {
    const data = JSON.stringify(testCases, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "evalora-test-cases.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const imported = JSON.parse(text) as TestCase[];
        if (Array.isArray(imported)) {
          onImport(imported);
        }
      } catch {
        alert("Invalid JSON file");
      }
    };
    input.click();
  }

  return (
    <Card padding="sm">
      <div className="flex items-center gap-2 px-2 py-1">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          Export JSON
        </Button>
        <Button variant="secondary" size="sm" onClick={handleImport}>
          Import JSON
        </Button>
      </div>
    </Card>
  );
}
