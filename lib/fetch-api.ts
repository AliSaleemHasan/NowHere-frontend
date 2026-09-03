import { refreshTokensApi } from "@/features/auth/api/auth-api";
import type { ApiResponse, HeaderContentType } from "@/types/api";
import { APIS, getApiURL } from "@/utils";
import { HttpClient, type RequestConfig } from "./http";
import { TokenProvider, ZustandTokenStorage } from "./token-provider";

export * from "./http";
export * from "./token-provider";

export const apiClient = new HttpClient(
  getApiURL,
  new TokenProvider(new ZustandTokenStorage(), refreshTokensApi),
);

export type FetchParams = {
  url: string;
  options?: Omit<RequestConfig, "contentType" | "api" | "auth">;
  contentType?: HeaderContentType;
  api?: APIS;
};

export const apiFetch = async <T>({
  url,
  options = {},
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<ApiResponse<T>> => {
  return apiClient.request<T>(url, {
    ...options,
    contentType,
    api,
    auth: false,
  });
};

export const apiAuthFetch = async <T>({
  url,
  options = {},
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<ApiResponse<T>> => {
  return apiClient.request<T>(url, {
    ...options,
    contentType,
    api,
    auth: true,
  });
};
