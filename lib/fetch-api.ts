import { useAuth } from "@/features/auth/context/auth-store";
import { FetchResponse, HeaderContentType } from "@/types/api";
import { API_URL } from "@/utils";

type FetchParams = {
  url: string;
  options: RequestInit;
  contentType?: HeaderContentType;
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
  const response = await fetch(`${API_URL}auth/refresh`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

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
}: FetchParams): Promise<FetchResponse<T>> => {
  const headers = getHeaders({ contentType });

  options.headers = {
    ...headers,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, options);
  const data = (await response.json()) as FetchResponse<T>;

  if (!data.success) {
    return Promise.reject(data);
  }

  return data;
};

/**
 * Performs an authenticated fetch request with automatic token refresh.
 */
export const apiAuthFetch = async <T>({
  url,
  options,
  contentType = "json",
}: FetchParams): Promise<FetchResponse<T>> => {
  const { accessToken, refreshToken } = useAuth.getState().tokens || {};

  if (!accessToken || !refreshToken) {
    return Promise.reject(
      new Error("User is not authorized to access this resource.")
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
    return await apiFetch<T>({ url, options });
  } catch (error: any) {
    // Handle token expiry (401)
    if (error?.statusCode === 401) {
      try {
        const data = await refresh(refreshToken);
        options.headers = getHeaders({
          contentType,
          authToken: data.tokens.accessToken,
        });
        return await apiFetch({ url, options, contentType });
      } catch (refreshError) {
        useAuth.getState().logout?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
};
