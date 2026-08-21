import type { ApiProblemDetails } from "@/types/api";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly problemDetails?: ApiProblemDetails;
  public readonly data?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    problemDetails?: ApiProblemDetails,
    data?: any,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.problemDetails = problemDetails;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public static fromResponse(statusCode: number, data: any, fallbackMessage?: string): ApiError {
    const message = ApiError.extractMessage(data, fallbackMessage || `Request failed with status ${statusCode}`);
    return new ApiError(message, statusCode, data, data);
  }

  public static extractMessage(data: any, fallback: string = "Request failed"): string {
    if (!data) return fallback;

    // RFC 9457 validation errors array
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.join(", ");
    }

    // RFC 9457 detail summary
    if (typeof data.detail === "string" && data.detail.trim().length > 0) {
      return data.detail;
    }

    // Common message field (array or string)
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message.join(", ");
    }
    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message;
    }

    // RFC 9457 title
    if (typeof data.title === "string" && data.title.trim().length > 0) {
      return data.title;
    }

    if (typeof data.error === "string" && data.error.trim().length > 0) {
      return data.error;
    }

    return fallback;
  }
}

export const extractErrorMessage = ApiError.extractMessage;
