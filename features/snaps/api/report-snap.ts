import { apiAuthFetch } from "@/lib/fetch-api";
import { ApiError, isApiError } from "@/lib/http/api-error";
import {
  isReportReason,
  MAX_REPORT_DETAILS,
  type ReportReason,
} from "../types/report-reasons";

export type ReportSnapInput = {
  reason: ReportReason;
  details?: string;
};

export function isDuplicateReportError(error: unknown): boolean {
  if (!isApiError(error)) return false;
  if (error.code === "DUPLICATE_REPORT") return true;
  return error.statusCode === 409;
}

export async function reportSnap(
  id: string,
  input: ReportSnapInput,
): Promise<void> {
  if (!id) {
    throw new ApiError("Snap id is required", 400);
  }
  if (!isReportReason(input.reason)) {
    throw new ApiError("A valid report reason is required", 400);
  }

  const details =
    typeof input.details === "string" ? input.details.trim() : "";
  const body: { reason: ReportReason; details?: string } = {
    reason: input.reason,
  };
  if (details) {
    body.details = details.slice(0, MAX_REPORT_DETAILS);
  }

  await apiAuthFetch({
    api: "snaps",
    url: `${id}/report`,
    options: { method: "POST", body },
  });
}
