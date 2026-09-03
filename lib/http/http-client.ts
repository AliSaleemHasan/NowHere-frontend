import type { ApiResponse, HeaderContentType, Tokens } from "@/types/api";
import { APIS, getApiURL } from "@/utils";
import { ApiError } from "./api-error";
import { isRecord } from "./is-record";
import type { ITokenProvider } from "../token-provider";

export type AuthMode = boolean | "optional";

export interface RequestConfig extends Omit<RequestInit, "headers" | "body"> {
  headers?: Record<string, string>;
  contentType?: HeaderContentType;
  api?: APIS;
  auth?: AuthMode;
  skipRetry?: boolean;
  body?: unknown;
}

function isApiSuccessEnvelope<T>(value: unknown): value is ApiResponse<T> {
  return isRecord(value) && value.success === true && "data" in value;
}

function toBodyInit(
  body: unknown,
  contentType: HeaderContentType,
): BodyInit | undefined {
  if (body == null) return undefined;
  if (typeof body === "string") return body;
  if (typeof FormData !== "undefined" && body instanceof FormData) return body;
  if (typeof Blob !== "undefined" && body instanceof Blob) return body;
  if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
    return body as BodyInit;
  }
  if (
    typeof URLSearchParams !== "undefined" &&
    body instanceof URLSearchParams
  ) {
    return body;
  }
  if (contentType === "json") {
    return JSON.stringify(body);
  }
  return String(body);
}

function networkErrorMessage(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "Network request failed";
  if (
    error instanceof TypeError ||
    message.toLowerCase().includes("network request failed")
  ) {
    return "Unable to connect to the server. Please check your internet connection.";
  }
  return message;
}

export class HttpClient {
  private refreshPromise: Promise<Tokens> | null = null;

  constructor(
    private readonly getBaseUrl: (api?: APIS) => string | undefined = getApiURL,
    private readonly tokenProvider?: ITokenProvider,
  ) {}

  private buildHeaders(
    contentType: HeaderContentType = "json",
    authToken?: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json, application/problem+json",
    };

    if (contentType === "json") {
      headers["Content-Type"] = "application/json";
    } else if (contentType === "html") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    } else if (contentType === "text") {
      headers["Content-Type"] = "text/plain";
    }

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    return headers;
  }

  private resolveUrl(endpoint: string = "", api?: APIS): string {
    const rawBaseUrl = (this.getBaseUrl(api) || "").trim().replace(/\/+$/, "");
    let cleanEndpoint = (endpoint || "").trim().replace(/^\/+/, "");

    if (api && (cleanEndpoint === api || cleanEndpoint.startsWith(`${api}/`))) {
      cleanEndpoint = cleanEndpoint.slice(api.length).replace(/^\/+/, "");
    }

    if (!rawBaseUrl) {
      return cleanEndpoint.startsWith("http://") ||
        cleanEndpoint.startsWith("https://")
        ? cleanEndpoint
        : `/${cleanEndpoint}`;
    }

    return cleanEndpoint ? `${rawBaseUrl}/${cleanEndpoint}` : rawBaseUrl;
  }

  private async refreshAccessToken(refreshToken: string): Promise<Tokens> {
    if (!this.tokenProvider) {
      throw new ApiError("Session expired. Please sign in again.", 401);
    }
    if (!this.refreshPromise) {
      this.refreshPromise = this.tokenProvider
        .refreshToken(refreshToken)
        .finally(() => {
          this.refreshPromise = null;
        });
    }
    return this.refreshPromise;
  }

  public async request<T>(
    endpoint: string = "",
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const {
      contentType = "json",
      api = "snaps",
      auth = false,
      skipRetry = false,
      headers: customHeaders = {},
      body,
      ...requestOptions
    } = config;

    const tokens = this.tokenProvider?.getTokens();
    let authToken: string | undefined;

    if (customHeaders["Authorization"]) {
      authToken = customHeaders["Authorization"].replace(/^Bearer\s+/i, "");
    } else if (auth === true) {
      if (!tokens?.accessToken || !tokens?.refreshToken) {
        await this.tokenProvider?.clearTokens();
        throw new ApiError(
          "User is not authorized to access this resource.",
          401,
        );
      }
      authToken = tokens.accessToken;
    } else if (auth === "optional") {
      authToken = tokens?.accessToken;
    }

    const defaultHeaders = this.buildHeaders(contentType, authToken);
    const finalHeaders = {
      ...defaultHeaders,
      ...customHeaders,
    };

    const url = this.resolveUrl(endpoint, api);

    let response: Response;
    try {
      response = await fetch(url, {
        ...requestOptions,
        method: requestOptions.method,
        credentials: "include",
        headers: finalHeaders,
        body: toBodyInit(body, contentType),
      });
    } catch (networkError: unknown) {
      console.warn(`Network request failed: ${url}`);
      throw new ApiError(
        networkErrorMessage(networkError),
        0,
        undefined,
        networkError,
      );
    }

    const rawText = await response.text();
    let parsed: unknown = rawText;
    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = rawText;
      }
    } else {
      parsed = null;
    }

    const envelopeFailed =
      isRecord(parsed) && parsed.success === false;
    if (!response.ok || envelopeFailed) {
      const statusFromBody = isRecord(parsed)
        ? typeof parsed.status === "number"
          ? parsed.status
          : typeof parsed.statusCode === "number"
            ? parsed.statusCode
            : undefined
        : undefined;
      const statusCode = response.status || statusFromBody || 500;

      if (
        statusCode === 401 &&
        auth &&
        !skipRetry &&
        tokens?.refreshToken &&
        this.tokenProvider
      ) {
        try {
          const refreshed = await this.refreshAccessToken(tokens.refreshToken);
          return await this.request<T>(endpoint, {
            ...config,
            skipRetry: true,
            headers: {
              ...customHeaders,
              Authorization: `Bearer ${refreshed.accessToken}`,
            },
          });
        } catch (refreshErr) {
          await this.tokenProvider.clearTokens();
          throw refreshErr;
        }
      }

      throw ApiError.fromResponse(statusCode, parsed, response.statusText);
    }

    if (isApiSuccessEnvelope<T>(parsed)) {
      return parsed;
    }

    return {
      success: true,
      data: parsed as T,
    };
  }

  public get<T>(
    endpoint: string,
    config?: Omit<RequestConfig, "method">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  public post<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  public put<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  public delete<T>(
    endpoint: string,
    config?: Omit<RequestConfig, "method">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}
