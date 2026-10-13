import { useState, useMemo } from "react";
import { Header } from "../../components/layout/Header";
import {
  TestCaseModal,
  ImportExportCard,
} from "../../components/test-cases/TestCaseModal";
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  EmptyState,
  Skeleton,
} from "../../components/ui";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  TestTube,
} from "lucide-react";
import { useAsync, useDebounce } from "../../hooks";
import { api } from "../../services/api";
import { formatDate } from "../../utils";
import type { TestCase, TestCaseCategory } from "../../types";

const categoryColors: Record<TestCaseCategory, string> = {
  factual: "info",
  reasoning: "purple",
  creative: "warning",
  technical: "success",
  general: "default",
};

export default function TestCasesPage() {
  const { data: fetchedCases, loading } = useAsync(
    () => api.getTestCases(),
    []
  );
  const [localCases, setLocalCases] = useState<TestCase[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<TestCase | undefined>();
  const [saving, setSaving] = useState(false);

  const debouncedSearch = useDebounce(search);

  const allCases = useMemo(() => {
    const merged = [...localCases, ...(fetchedCases ?? [])];
    // Deduplicate by ID
    const map = new Map<string, TestCase>();
    for (const tc of merged) map.set(tc.id, tc);
    return Array.from(map.values());
  }, [localCases, fetchedCases]);

  const filtered = useMemo(() => {
    return allCases.filter((tc) => {
      const matchSearch =
        !debouncedSearch ||
        tc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tc.prompt.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tc.tags.some((t) =>
          t.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      const matchCategory =
        categoryFilter === "all" || tc.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [allCases, debouncedSearch, categoryFilter]);

  async function handleSave(
    data: Omit<TestCase, "id" | "createdAt" | "updatedAt">
  ) {
    setSaving(true);
    try {
      if (editingCase) {
        const updated = await api.updateTestCase(editingCase.id, data);
        setLocalCases((prev) =>
          prev.map((tc) => (tc.id === editingCase.id ? updated : tc))
        );
      } else {
        const created = await api.createTestCase(data);
        setLocalCases((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditingCase(undefined);
    } catch {
      // silent in demo
    } finally {
      setSaving(false);
    }
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this test case?")) return;
    api.deleteTestCase(id);
    setLocalCases((prev) => prev.filter((tc) => tc.id !== id));
  }

  function handleEdit(tc: TestCase) {
    setEditingCase(tc);
    setModalOpen(true);
  }

  function handleImport(imported: TestCase[]) {
    setLocalCases((prev) => [...imported, ...prev]);
  }

  return (
    <div className="space-y-6">
      <Header
        title="Test Cases"
        subtitle="Manage your evaluation test suite"
        actions={
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingCase(undefined);
              setModalOpen(true);
            }}
          >
            Add Test Case
          </Button>
        }
      />

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3 px-2 py-1">
          <div className="flex-1">
            <Input
              placeholder="Search test cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { value: "all", label: "All Categories" },
                { value: "factual", label: "Factual" },
                { value: "reasoning", label: "Reasoning" },
                { value: "creative", label: "Creative" },
                { value: "technical", label: "Technical" },
                { value: "general", label: "General" },
              ]}
            />
          </div>
        </div>
      </Card>

      <ImportExportCard testCases={allCases} onImport={handleImport} />

      {/* Test case list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <div className="flex items-start gap-4">
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-96" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<TestTube className="w-7 h-7" />}
          title={allCases.length === 0 ? "No Test Cases" : "No Results"}
          description={
            allCases.length === 0
              ? "Create your first test case to get started."
              : "Try adjusting your search or filters."
          }
          action={
            allCases.length === 0 ? (
              <Button
                onClick={() => {
                  setEditingCase(undefined);
                  setModalOpen(true);
                }}
              >
                Add Test Case
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((tc) => (
            <Card key={tc.id} hover padding="md">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {tc.name}
                    </h3>
                    <Badge
                      variant={
                        categoryColors[tc.category] as
                          | "default"
                          | "success"
                          | "warning"
                          | "danger"
                          | "info"
                          | "purple"
                      }
                    >
                      {tc.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                    {tc.prompt}
                  </p>
                  {tc.expectedOutput && (
                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-1 line-clamp-1">
                      Expected: {tc.expectedOutput}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {tc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-gray-400">
                      · {formatDate(tc.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(tc)}
                    className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                    aria-label="Edit test case"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tc.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                    aria-label="Delete test case"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TestCaseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCase(undefined);
        }}
        onSave={handleSave}
        initialData={editingCase}
        loading={saving}
      />
    </div>
  );
}
