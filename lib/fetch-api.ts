import { refreshTokensApi } from "@/features/auth/api/auth-api";
import type { ApiResponse, HeaderContentType } from "@/types/api";
import { APIS, getApiURL } from "@/utils";
import { HttpClient } from "./http";
import { TokenProvider, ZustandTokenStorage } from "./token-provider";

// Re-export modular types and classes
export * from "./http";
export * from "./token-provider";

// Default singleton instance with pure SoC: Zustand handles state, auth-api handles refresh network call
export const apiClient = new HttpClient(
  getApiURL,
  new TokenProvider(new ZustandTokenStorage(), refreshTokensApi),
);

export type FetchParams = {
  url: string;
  options: RequestInit;
  contentType?: HeaderContentType;
  api?: APIS;
};

/**
 * Performs a generic (unauthenticated) fetch request.
 */
export const apiFetch = async <T>({
  url,
  options,
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<ApiResponse<T>> => {
  return apiClient.request<T>(url, {
    ...options,
    headers: options.headers as Record<string, string>,
    contentType,
    api,
    auth: false,
  });
};

/**
 * Performs an authenticated fetch request with automatic token refresh.
 */
export const apiAuthFetch = async <T>({
  url,
  options,
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<ApiResponse<T>> => {
  return apiClient.request<T>(url, {
    ...options,
    headers: options.headers as Record<string, string>,
    contentType,
    api,
    auth: true,
  });
};

/**
 * Performs a hybrid request (authenticated if tokens exist, unauthenticated otherwise).
 */
export const apiHybridFetch = async <T>({
  url,
  options,
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<ApiResponse<T>> => {
  return apiClient.request<T>(url, {
    ...options,
    headers: options.headers as Record<string, string>,
    contentType,
    api,
    auth: "optional",
  });
};

