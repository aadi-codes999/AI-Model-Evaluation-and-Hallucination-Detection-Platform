import type { ClassValue } from "./types-internal";

/** Merge CSS class names, filtering out falsy values */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

/** Format a date string to a readable locale format */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a date string to a relative time string */
export function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

/** Format milliseconds to human-readable latency */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/** Format a number as a percentage */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format a score (0–1) to a display value (0–100) */
export function formatScore(value: number): string {
  return (value * 100).toFixed(0);
}

/** Get a color class based on score */
export function scoreColor(score: number): string {
  if (score >= 0.8) return "text-emerald-600";
  if (score >= 0.6) return "text-amber-600";
  return "text-red-500";
}

/** Get severity badge color */
export function severityColor(
  severity: "low" | "medium" | "high"
): string {
  switch (severity) {
    case "low":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "medium":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "high":
      return "bg-red-50 text-red-700 border-red-200";
  }
}

/** Generate a pseudo-random ID */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/** Download a string as a file */
export function downloadFile(
  content: string,
  filename: string,
  mime = "text/csv"
): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Convert array of objects to CSV */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: { key: keyof T; label: string }[]
): string {
  const header = columns.map((c) => c.label).join(",");
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = String(val ?? "");
        return str.includes(",") ? `"${str}"` : str;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}
