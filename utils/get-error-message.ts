import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";

export const getErrorMessage = (
  err: unknown,
  fallback = i18n.t("errors.generic"),
): string => {
  if (err instanceof ApiError) {
    if (err.statusCode === 429) {
      return ApiError.getDefaultStatusMessage(429);
    }
    return err.message || fallback;
  }
  if (err instanceof TypeError) {
    return i18n.t("errors.network");
  }
  if (err instanceof Error && err.message.trim().length > 0) {
    return err.message;
  }
  return fallback;
};

export const getApiValidationErrors = (err: unknown): string[] | undefined => {
  if (err instanceof ApiError && err.problemDetails?.errors?.length) {
    return err.problemDetails.errors;
  }
  return undefined;
};
