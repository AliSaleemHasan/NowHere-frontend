import type { ApiProblemDetails } from "@/types/api";
import { isRecord } from "./is-record";

function stringifyUnknown(value: unknown): string {
  if (typeof value === "string") return value;
  if (isRecord(value) && typeof value.message === "string") return value.message;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly problemDetails?: ApiProblemDetails;
  public readonly data?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    problemDetails?: ApiProblemDetails,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.problemDetails = problemDetails;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get code(): string | undefined {
    return this.problemDetails?.code;
  }

  public static fromResponse(
    statusCode: number,
    data: unknown,
    fallbackMessage?: string,
  ): ApiError {
    const fallback =
      fallbackMessage || ApiError.getDefaultStatusMessage(statusCode);
    const message = ApiError.extractMessage(data, fallback);
    const problemDetails = ApiError.asProblemDetails(data);

    return new ApiError(message, statusCode, problemDetails, data);
  }

  public static asProblemDetails(data: unknown): ApiProblemDetails | undefined {
    if (!isRecord(data)) return undefined;
    if (
      typeof data.title !== "string" &&
      typeof data.detail !== "string" &&
      typeof data.status !== "number"
    ) {
      return undefined;
    }

    return {
      type: typeof data.type === "string" ? data.type : "about:blank",
      title: typeof data.title === "string" ? data.title : "Error",
      status: typeof data.status === "number" ? data.status : 500,
      detail: typeof data.detail === "string" ? data.detail : "",
      instance: typeof data.instance === "string" ? data.instance : "",
      timestamp:
        typeof data.timestamp === "string"
          ? data.timestamp
          : new Date().toISOString(),
      errors: Array.isArray(data.errors)
        ? data.errors.filter((item): item is string => typeof item === "string")
        : undefined,
      code: typeof data.code === "string" ? data.code : undefined,
    };
  }

  public static getDefaultStatusMessage(statusCode: number): string {
    switch (statusCode) {
      case 0:
        return "Unable to connect to the server. Please check your internet connection.";
      case 400:
        return "Invalid request. Please check your inputs.";
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "A record with this information already exists.";
      case 422:
        return "Validation failed. Please verify your submitted data.";
      case 429:
        return "Too many attempts. Please wait a minute and try again.";
      case 500:
      case 502:
      case 503:
      case 504:
        return "Server error occurred. Please try again later.";
      default:
        return `Request failed with status ${statusCode}`;
    }
  }

  public static extractMessage(
    data: unknown,
    fallback: string = "Request failed",
  ): string {
    if (data == null) return fallback;

    if (typeof data === "string" && data.trim().length > 0) {
      return data.trim();
    }

    if (!isRecord(data)) return fallback;

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(stringifyUnknown).join(", ");
    }

    if (typeof data.detail === "string" && data.detail.trim().length > 0) {
      return data.detail.trim();
    }

    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.map(stringifyUnknown).join(", ");
    }

    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message.trim();
    }

    if (typeof data.title === "string" && data.title.trim().length > 0) {
      return data.title.trim();
    }

    if (typeof data.error === "string" && data.error.trim().length > 0) {
      return data.error.trim();
    }

    return fallback;
  }
}

export const extractErrorMessage = ApiError.extractMessage;

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
