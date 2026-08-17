import { useAuth } from "@/features/auth/context/auth-store";
import { FetchResponse, HeaderContentType } from "@/types/api";
import { APIS, getApiURL } from "@/utils";

type FetchParams = {
  url: string;
  options: RequestInit;
  contentType?: HeaderContentType;
  api?: APIS;
};

const getHeaders = ({
  contentType = "json",
  authToken,
}: {
  contentType?: HeaderContentType;
  authToken?: string;
}): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type":
      {
        json: "application/json",
        files: "multipart/form-data",
        html: "application/x-www-form-urlencoded",
        text: "text/plain",
      }[contentType] || "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  return headers;
};

/**
 * 

      Get refresh tokens
 */

const refresh = async (token: string) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_AUTH_URL}/auth/refresh`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();
  if (!data.success) return Promise.reject(data.message);
  useAuth.getState().setTokens(data.data.tokens);
  return data.data;
};

/**
 * Performs a generic (unauthenticated) fetch request.
 */
export const apiFetch = async <T>({
  url,
  options,
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<FetchResponse<T>> => {
  const headers = getHeaders({ contentType });

  options.headers = {
    ...headers,
    ...options.headers,
  };

  const response = await fetch(`${getApiURL(api)}/${url}`, options);

  let data: any;
  const rawText = await response.text();
  try {
    data = JSON.parse(rawText);
  } catch {
    data = response.ok
      ? { success: true, data: rawText }
      : { success: false, message: rawText || response.statusText };
  }

  if (!response.ok || (data && data.success === false)) {
    const errorMsg = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message || data?.error || response.statusText || "Request failed";
    const error: any = new Error(errorMsg);
    error.statusCode = response.status || data?.statusCode;
    error.data = data;
    return Promise.reject(error);
  }

  return data as FetchResponse<T>;
};

// might be authenticated - might not , depends on user credential if they are found
export const apiHypridFetch = async <T>(
  options: FetchParams,
): Promise<FetchResponse<T>> => {
  const isLoggedIn = await useAuth.getState().isLoggedIn;

  if (isLoggedIn) return apiAuthFetch(options);
  return apiFetch(options);
};

/**
 * Performs an authenticated fetch request with automatic token refresh.
 */
export const apiAuthFetch = async <T>({
  url,
  options,
  contentType = "json",
  api = "snaps",
}: FetchParams): Promise<FetchResponse<T>> => {
  const { accessToken, refreshToken } = (await useAuth.getState().tokens) || {};

  if (!accessToken || !refreshToken) {
    useAuth.getState().logout();
    return Promise.reject(
      new Error("User is not authorized to access this resource."),
    );
  }

  const setAuthHeaders = (token: string) => {
    options.headers = {
      ...getHeaders({ contentType, authToken: token }),
      ...options.headers,
    };
  };

  setAuthHeaders(accessToken);

  try {
    const data = await apiFetch<T>({ url, options, api });
    return data;
  } catch (error: any) {
    // Handle token expiry (401)
    if (error?.statusCode === 401) {
      try {
        console.log("now refreshing the token...");
        const data = await refresh(refreshToken);
        options.headers = getHeaders({
          contentType,
          authToken: data.tokens.accessToken,
        });
        return await apiFetch({ url, options, contentType, api });
      } catch (refreshError) {
        useAuth.getState().logout?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
};
