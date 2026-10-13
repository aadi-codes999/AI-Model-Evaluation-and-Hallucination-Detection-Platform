/**
 * Demo data for the Evalora frontend.
 *
 * IMPORTANT: All scores, responses, and metrics below are clearly labeled
 * synthetic demonstration data. They do NOT represent real AI model outputs,
 * factual verification evidence, or actual evaluation scores. This data is
 * used solely for UI development and testing when the backend is unavailable.
 */

import type {
  Evaluation,
  TestCase,
  DashboardStats,
  ActivityItem,
  TrendDataPoint,
  ModelPerformancePoint,
  ReportDataPoint,
  ModelComparison,
} from "../types";

// ── Dashboard ────────────────────────────────────────────────────────

export const DEMO_DASHBOARD_STATS: DashboardStats = {
  totalEvaluations: 247,
  avgScore: 0.82,
  modelsActive: 2,
  hallucinationsDetected: 34,
  evaluationsTrend: 12.5,
  scoreTrend: 3.2,
};

export const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: "act-1",
    type: "evaluation",
    title: "Science QA Evaluation",
    description: "Evaluated Gemini & Grok on 15 science questions",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: "completed",
  },
  {
    id: "act-2",
    type: "comparison",
    title: "Model Comparison: History",
    description: "Side-by-side comparison on historical prompts",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "act-3",
    type: "evaluation",
    title: "Creative Writing Test",
    description: "Evaluated response quality on creative prompts",
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    status: "completed",
  },
  {
    id: "act-4",
    type: "test_case",
    title: "New Test Suite: Math",
    description: "Added 20 math reasoning test cases",
    timestamp: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "act-5",
    type: "evaluation",
    title: "Technical Documentation",
    description: "Evaluated factuality of API documentation responses",
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    status: "failed",
  },
];

export const DEMO_TRENDS: TrendDataPoint[] = Array.from(
  { length: 14 },
  (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return {
      date: d.toISOString().slice(0, 10),
      evaluations: Math.floor(10 + Math.random() * 25),
      avgScore: +(0.7 + Math.random() * 0.2).toFixed(2),
    };
  }
);

export const DEMO_MODEL_PERFORMANCE: ModelPerformancePoint[] = [
  { name: "Relevance", gemini: 0.88, grok: 0.84 },
  { name: "Factuality", gemini: 0.82, grok: 0.79 },
  { name: "Coherence", gemini: 0.91, grok: 0.87 },
  { name: "Completeness", gemini: 0.76, grok: 0.81 },
  { name: "Evidence", gemini: 0.73, grok: 0.68 },
];

// ── Evaluations ──────────────────────────────────────────────────────

export const DEMO_EVALUATIONS: Evaluation[] = [
  {
    id: "eval-001",
    prompt: "Explain quantum entanglement in simple terms.",
    context: "Target audience: high school students",
    models: ["gemini", "grok"],
    criteria: {
      relevance: true,
      factuality: true,
      coherence: true,
      completeness: true,
      evidenceCoverage: false,
    },
    responses: [
      {
        modelId: "gemini",
        text: "[Demo] Quantum entanglement is a phenomenon where two particles become connected so that the state of one instantly affects the other, no matter the distance between them. Think of it like having two magic coins – when you flip one and it lands on heads, the other one will always land on tails, instantaneously.",
        latencyMs: 1240,
        tokenCount: 312,
        scores: {
          relevance: 0.92,
          factuality: 0.85,
          coherence: 0.94,
          completeness: 0.78,
          evidenceCoverage: 0.7,
          overall: 0.84,
        },
        hallucinations: [
          {
            id: "h-1",
            snippet: "instantly affects the other",
            severity: "low",
            explanation:
              "[Demo flag] The word 'instantly' oversimplifies the nuance around information transfer vs. correlation.",
          },
        ],
      },
      {
        modelId: "grok",
        text: "[Demo] Quantum entanglement is when two particles are linked together. If you measure one particle, you immediately know something about the other particle, even if they're on opposite sides of the universe. It's one of the strangest parts of quantum physics.",
        latencyMs: 980,
        tokenCount: 276,
        scores: {
          relevance: 0.88,
          factuality: 0.82,
          coherence: 0.9,
          completeness: 0.72,
          evidenceCoverage: 0.65,
          overall: 0.79,
        },
        hallucinations: [],
      },
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3540000).toISOString(),
  },
  {
    id: "eval-002",
    prompt: "What are the health benefits of intermittent fasting?",
    models: ["gemini"],
    criteria: {
      relevance: true,
      factuality: true,
      coherence: false,
      completeness: true,
      evidenceCoverage: true,
    },
    responses: [
      {
        modelId: "gemini",
        text: "[Demo] Intermittent fasting has been associated with several potential health benefits including weight management, improved insulin sensitivity, and reduced inflammation. Some studies suggest it may support cellular repair through autophagy.",
        latencyMs: 1100,
        tokenCount: 245,
        scores: {
          relevance: 0.9,
          factuality: 0.78,
          coherence: 0.88,
          completeness: 0.82,
          evidenceCoverage: 0.75,
          overall: 0.83,
        },
        hallucinations: [
          {
            id: "h-2",
            snippet: "reduced inflammation",
            severity: "medium",
            explanation:
              "[Demo flag] Evidence for inflammation reduction from IF is mixed and context-dependent.",
          },
        ],
      },
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7140000).toISOString(),
  },
  {
    id: "eval-003",
    prompt: "Describe the process of photosynthesis.",
    models: ["gemini", "grok"],
    criteria: {
      relevance: true,
      factuality: true,
      coherence: true,
      completeness: true,
      evidenceCoverage: true,
    },
    responses: [],
    status: "pending",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "eval-004",
    prompt: "Compare REST and GraphQL API architectures.",
    models: ["grok"],
    criteria: {
      relevance: true,
      factuality: true,
      coherence: true,
      completeness: false,
      evidenceCoverage: false,
    },
    responses: [
      {
        modelId: "grok",
        text: "[Demo] REST uses standard HTTP methods with fixed endpoints, while GraphQL lets clients specify exactly what data they need through a single endpoint. REST is simpler for basic CRUD, while GraphQL excels with complex, nested data requirements.",
        latencyMs: 870,
        tokenCount: 198,
        scores: {
          relevance: 0.94,
          factuality: 0.89,
          coherence: 0.92,
          completeness: 0.7,
          evidenceCoverage: 0.6,
          overall: 0.81,
        },
        hallucinations: [],
      },
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86340000).toISOString(),
  },
];

// ── Test Cases ───────────────────────────────────────────────────────

export const DEMO_TEST_CASES: TestCase[] = [
  {
    id: "tc-001",
    name: "Quantum Physics Basics",
    prompt: "Explain quantum entanglement in simple terms.",
    expectedOutput:
      "Should mention particle correlation, measurement effects, and Einstein's 'spooky action'.",
    category: "factual",
    tags: ["physics", "science"],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "tc-002",
    name: "Math Reasoning: Algebra",
    prompt: "Solve for x: 3x + 7 = 22",
    expectedOutput: "x = 5",
    category: "reasoning",
    tags: ["math", "algebra"],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "tc-003",
    name: "Creative Story Opener",
    prompt: "Write the opening paragraph of a mystery novel set in Venice.",
    category: "creative",
    tags: ["writing", "fiction"],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "tc-004",
    name: "API Design Review",
    prompt: "Review this REST API design for a to-do app and suggest improvements.",
    expectedOutput:
      "Should mention resource naming, HTTP methods, pagination, error handling.",
    category: "technical",
    tags: ["api", "review"],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: "tc-005",
    name: "General Knowledge: Capitals",
    prompt: "What is the capital of Australia?",
    expectedOutput: "Canberra (not Sydney)",
    category: "general",
    tags: ["geography", "trivia"],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: "tc-006",
    name: "Code Explanation",
    prompt: "Explain what this Python function does: def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)",
    expectedOutput:
      "Should identify it as recursive Fibonacci, mention base cases, and note exponential time complexity.",
    category: "technical",
    tags: ["python", "algorithms"],
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

// ── Reports ──────────────────────────────────────────────────────────

export const DEMO_REPORT_DATA: ReportDataPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return {
      date: d.toISOString().slice(0, 10),
      evaluations: Math.floor(5 + Math.random() * 20),
      avgScore: +(0.65 + Math.random() * 0.25).toFixed(2),
      hallucinationRate: +(0.05 + Math.random() * 0.2).toFixed(3),
    };
  }
);

// ── Comparisons ──────────────────────────────────────────────────────

export const DEMO_COMPARISONS: ModelComparison[] = [
  {
    id: "cmp-001",
    evaluationId: "eval-001",
    prompt: "Explain quantum entanglement in simple terms.",
    metrics: {
      relevance: { gemini: 0.92, grok: 0.88 },
      factuality: { gemini: 0.85, grok: 0.82 },
      evidenceCoverage: { gemini: 0.7, grok: 0.65 },
      similarity: 0.76,
    },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];
