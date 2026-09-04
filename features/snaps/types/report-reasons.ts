export const REPORT_REASONS = [
  "spam",
  "inappropriate",
  "wrong_place",
  "other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const MAX_REPORT_DETAILS = 1000;

export function isReportReason(value: unknown): value is ReportReason {
  return (
    typeof value === "string" &&
    (REPORT_REASONS as readonly string[]).includes(value)
  );
}
