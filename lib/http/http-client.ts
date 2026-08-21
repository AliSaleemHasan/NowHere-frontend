import type { ApiResponse, HeaderContentType } from "@/types/api";
import { APIS, getApiURL } from "@/utils";
import { ApiError } from "./api-error";
import type { ITokenProvider } from "../token-provider";

export type AuthMode = boolean | "optional";

export interface RequestConfig extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  contentType?: HeaderContentType;
  api?: APIS;
  auth?: AuthMode;
  skipRetry?: boolean;
}

export class HttpClient {
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
    // When contentType === 'files', omit Content-Type so fetch automatically sets the multipart boundary

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    return headers;
  }

  public async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const {
      contentType = "json",
      api = "snaps",
      auth = false,
      skipRetry = false,
      headers: customHeaders = {},
      ...requestOptions
    } = config;

    const tokens = this.tokenProvider?.getTokens();
    let authToken: string | undefined;

    if (auth === true) {
      if (!tokens?.accessToken || !tokens?.refreshToken) {
        await this.tokenProvider?.clearTokens();
        throw new ApiError("User is not authorized to access this resource.", 401);
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

    const baseUrl = this.getBaseUrl(api) || "";
    const url = baseUrl ? `${baseUrl}/${endpoint}` : endpoint;
    const response = await fetch(url, {
      ...requestOptions,
      headers: finalHeaders,
    });

    let data: any;
    const rawText = await response.text();
    try {
      data = JSON.parse(rawText);
    } catch {
      data = response.ok
        ? { success: true, data: rawText }
        : { success: false, detail: rawText || response.statusText };
    }

    // Handle HTTP Errors & 401 Token Refresh Interception
    if (!response.ok || (data && typeof data === "object" && data.success === false)) {
      const statusCode = response.status || data?.status || data?.statusCode || 500;

      if (statusCode === 401 && auth && !skipRetry && tokens?.refreshToken && this.tokenProvider) {
        try {
          const refreshed = await this.tokenProvider.refreshToken(tokens.refreshToken);
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

      throw ApiError.fromResponse(statusCode, data, response.statusText);
    }

    // Normalize uniform ApiResponse envelope: { success: true, data: T }
    if (data && typeof data === "object" && "success" in data && "data" in data) {
      return data as ApiResponse<T>;
    }

    return {
      success: true,
      data: data as T,
    };
  }

  public get<T>(endpoint: string, config?: Omit<RequestConfig, "method">): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  public post<T>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  public put<T>(
    endpoint: string,
    body?: any,
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
