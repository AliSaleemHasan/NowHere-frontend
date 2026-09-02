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

  public static fromResponse(
    statusCode: number,
    data: any,
    fallbackMessage?: string,
  ): ApiError {
    const fallback =
      fallbackMessage || ApiError.getDefaultStatusMessage(statusCode);
    const message = ApiError.extractMessage(data, fallback);
    const problemDetails: ApiProblemDetails | undefined =
      data && typeof data === "object" ? data : undefined;

    return new ApiError(message, statusCode, problemDetails, data);
  }

  public static getDefaultStatusMessage(statusCode: number): string {
    switch (statusCode) {
      case 0:
        return "Unable to connect to the server. Please check your internet connection.";
      case 400:
        return "Invalid request. Please check your inputs.";
      case 401:
        return "Invalid email or password.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "A record with this information already exists.";
      case 422:
        return "Validation failed. Please verify your submitted data.";
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
    data: any,
    fallback: string = "Request failed",
  ): string {
    if (!data) return fallback;

    // Plain text / string response
    if (typeof data === "string" && data.trim().length > 0) {
      return data.trim();
    }

    // RFC 9457 validation errors array
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
        .map((e: any) =>
          typeof e === "string" ? e : e?.message || JSON.stringify(e),
        )
        .join(", ");
    }

    // RFC 9457 detail summary
    if (typeof data.detail === "string" && data.detail.trim().length > 0) {
      return data.detail.trim();
    }

    // Common NestJS / Express message field (array or string)
    if (Array.isArray(data.message) && data.message.length > 0) {
      return data.message
        .map((e: any) =>
          typeof e === "string" ? e : e?.message || JSON.stringify(e),
        )
        .join(", ");
    }
    if (typeof data.message === "string" && data.message.trim().length > 0) {
      return data.message.trim();
    }

    // RFC 9457 title
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

