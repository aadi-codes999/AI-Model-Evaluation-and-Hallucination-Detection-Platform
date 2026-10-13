// ── Model types ──────────────────────────────────────────────────────
export type ModelId = "gemini" | "grok";

export interface ModelInfo {
  id: ModelId;
  name: string;
  provider: string;
  description: string;
}

// ── Evaluation types ─────────────────────────────────────────────────
export type EvaluationStatus = "pending" | "running" | "completed" | "failed";

export interface EvaluationCriteria {
  relevance: boolean;
  factuality: boolean;
  coherence: boolean;
  completeness: boolean;
  evidenceCoverage: boolean;
}

export interface EvaluationScore {
  relevance: number;
  factuality: number;
  coherence: number;
  completeness: number;
  evidenceCoverage: number;
  overall: number;
}

export interface ModelResponse {
  modelId: ModelId;
  text: string;
  latencyMs: number;
  tokenCount: number;
  scores: EvaluationScore;
  hallucinations: HallucinationFlag[];
}

export interface HallucinationFlag {
  id: string;
  snippet: string;
  severity: "low" | "medium" | "high";
  explanation: string;
}

export interface Evaluation {
  id: string;
  prompt: string;
  context?: string;
  models: ModelId[];
  criteria: EvaluationCriteria;
  responses: ModelResponse[];
  status: EvaluationStatus;
  createdAt: string;
  completedAt?: string;
}

// ── Comparison types ─────────────────────────────────────────────────
export interface ComparisonMetrics {
  relevance: Record<ModelId, number>;
  factuality: Record<ModelId, number>;
  evidenceCoverage: Record<ModelId, number>;
  similarity: number;
}

export interface ModelComparison {
  id: string;
  evaluationId: string;
  prompt: string;
  metrics: ComparisonMetrics;
  createdAt: string;
}

// ── Test case types ──────────────────────────────────────────────────
export type TestCaseCategory =
  | "factual"
  | "reasoning"
  | "creative"
  | "technical"
  | "general";

export interface TestCase {
  id: string;
  name: string;
  prompt: string;
  expectedOutput?: string;
  category: TestCaseCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Report types ─────────────────────────────────────────────────────
export interface ReportDataPoint {
  date: string;
  evaluations: number;
  avgScore: number;
  hallucinationRate: number;
}

export interface PerformanceSummary {
  totalEvaluations: number;
  avgOverallScore: number;
  avgLatencyMs: number;
  hallucinationRate: number;
  topModel: ModelId;
}

// ── Dashboard types ──────────────────────────────────────────────────
export interface DashboardStats {
  totalEvaluations: number;
  avgScore: number;
  modelsActive: number;
  hallucinationsDetected: number;
  evaluationsTrend: number;
  scoreTrend: number;
}

export interface ActivityItem {
  id: string;
  type: "evaluation" | "comparison" | "test_case";
  title: string;
  description: string;
  timestamp: string;
  status?: EvaluationStatus;
}

export interface TrendDataPoint {
  date: string;
  evaluations: number;
  avgScore: number;
}

export interface ModelPerformancePoint {
  name: string;
  gemini: number;
  grok: number;
}

// ── Settings types ───────────────────────────────────────────────────
export type ThemeMode = "light" | "dark" | "system";

export interface WorkspaceSettings {
  theme: ThemeMode;
  workspaceName: string;
  defaultModels: ModelId[];
  autoSave: boolean;
  notificationsEnabled: boolean;
}

export interface ConnectionStatus {
  connected: boolean;
  latencyMs: number | null;
  lastChecked: string | null;
  version: string | null;
}

// ── API response wrappers ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
