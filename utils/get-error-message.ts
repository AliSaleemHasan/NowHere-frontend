import { ApiError } from "@/lib/http/api-error";

export const getErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (err instanceof ApiError) {
    if (err.statusCode === 429) {
      return ApiError.getDefaultStatusMessage(429);
    }
    return err.message || fallback;
  }
  if (err instanceof TypeError) {
    return "Unable to connect to the server. Please check your internet connection.";
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
