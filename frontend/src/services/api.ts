/**
 * Evalora API service.
 *
 * Communicates with the FastAPI backend at VITE_API_BASE_URL.
 * When the backend is unavailable, all methods fall back to clearly
 * labeled demo data so the UI remains fully functional.
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
  ConnectionStatus,
  EvaluationCriteria,
  ModelId,
} from "../types";

import {
  DEMO_DASHBOARD_STATS,
  DEMO_ACTIVITY,
  DEMO_TRENDS,
  DEMO_MODEL_PERFORMANCE,
  DEMO_EVALUATIONS,
  DEMO_TEST_CASES,
  DEMO_REPORT_DATA,
  DEMO_COMPARISONS,
} from "./demo-data";

// ── Base client ──────────────────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

let _isBackendAvailable: boolean | null = null;

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }
  return (await res.json()) as T;
}

async function checkBackend(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Simulate network latency for demo mode */
function demoDelay(ms = 400): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Public API ───────────────────────────────────────────────────────

export const api = {
  // ── Connection ───────────────────────────────────────────────────
  async getConnectionStatus(): Promise<ConnectionStatus> {
    const connected = await checkBackend();
    _isBackendAvailable = connected;
    if (connected) {
      try {
        const data = await apiFetch<{ version: string }>("/health");
        return {
          connected: true,
          latencyMs: 45,
          lastChecked: new Date().toISOString(),
          version: data.version ?? "unknown",
        };
      } catch {
        /* fall through */
      }
    }
    return {
      connected: false,
      latencyMs: null,
      lastChecked: new Date().toISOString(),
      version: null,
    };
  },

  isDemo(): boolean {
    return !_isBackendAvailable;
  },

  // ── Dashboard ────────────────────────────────────────────────────
  async getDashboardStats(): Promise<DashboardStats> {
    if (_isBackendAvailable) {
      return apiFetch<DashboardStats>("/dashboard/stats");
    }
    await demoDelay();
    return DEMO_DASHBOARD_STATS;
  },

  async getRecentActivity(): Promise<ActivityItem[]> {
    if (_isBackendAvailable) {
      return apiFetch<ActivityItem[]>("/dashboard/activity");
    }
    await demoDelay(300);
    return DEMO_ACTIVITY;
  },

  async getTrends(): Promise<TrendDataPoint[]> {
    if (_isBackendAvailable) {
      return apiFetch<TrendDataPoint[]>("/dashboard/trends");
    }
    await demoDelay(350);
    return DEMO_TRENDS;
  },

  async getModelPerformance(): Promise<ModelPerformancePoint[]> {
    if (_isBackendAvailable) {
      return apiFetch<ModelPerformancePoint[]>("/dashboard/model-performance");
    }
    await demoDelay(300);
    return DEMO_MODEL_PERFORMANCE;
  },

  // ── Evaluations ──────────────────────────────────────────────────
  async getEvaluations(): Promise<Evaluation[]> {
    if (_isBackendAvailable) {
      return apiFetch<Evaluation[]>("/evaluations");
    }
    await demoDelay();
    return DEMO_EVALUATIONS;
  },

  async getEvaluation(id: string): Promise<Evaluation | undefined> {
    if (_isBackendAvailable) {
      return apiFetch<Evaluation>(`/evaluations/${id}`);
    }
    await demoDelay(250);
    return DEMO_EVALUATIONS.find((e) => e.id === id);
  },

  async createEvaluation(payload: {
    prompt: string;
    context?: string;
    models: ModelId[];
    criteria: EvaluationCriteria;
  }): Promise<Evaluation> {
    if (_isBackendAvailable) {
      return apiFetch<Evaluation>("/evaluations", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    await demoDelay(800);
    const newEval: Evaluation = {
      id: `eval-demo-${Date.now()}`,
      prompt: payload.prompt,
      context: payload.context,
      models: payload.models,
      criteria: payload.criteria,
      responses: [],
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    return newEval;
  },

  // ── Comparisons ──────────────────────────────────────────────────
  async getComparisons(): Promise<ModelComparison[]> {
    if (_isBackendAvailable) {
      return apiFetch<ModelComparison[]>("/comparisons");
    }
    await demoDelay();
    return DEMO_COMPARISONS;
  },

  // ── Test Cases ───────────────────────────────────────────────────
  async getTestCases(): Promise<TestCase[]> {
    if (_isBackendAvailable) {
      return apiFetch<TestCase[]>("/test-cases");
    }
    await demoDelay();
    return [...DEMO_TEST_CASES];
  },

  async createTestCase(
    payload: Omit<TestCase, "id" | "createdAt" | "updatedAt">
  ): Promise<TestCase> {
    if (_isBackendAvailable) {
      return apiFetch<TestCase>("/test-cases", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    await demoDelay(300);
    const now = new Date().toISOString();
    return { ...payload, id: `tc-demo-${Date.now()}`, createdAt: now, updatedAt: now };
  },

  async updateTestCase(
    id: string,
    payload: Partial<TestCase>
  ): Promise<TestCase> {
    if (_isBackendAvailable) {
      return apiFetch<TestCase>(`/test-cases/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    }
    await demoDelay(250);
    const existing = DEMO_TEST_CASES.find((t) => t.id === id);
    if (!existing) throw new Error("Test case not found");
    return { ...existing, ...payload, updatedAt: new Date().toISOString() };
  },

  async deleteTestCase(id: string): Promise<void> {
    if (_isBackendAvailable) {
      await apiFetch(`/test-cases/${id}`, { method: "DELETE" });
      return;
    }
    await demoDelay(200);
  },

  // ── Reports ──────────────────────────────────────────────────────
  async getReportData(): Promise<ReportDataPoint[]> {
    if (_isBackendAvailable) {
      return apiFetch<ReportDataPoint[]>("/reports/data");
    }
    await demoDelay();
    return DEMO_REPORT_DATA;
  },
};
