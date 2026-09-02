import { apiAuthFetch, apiFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import type { ApiResponse, UserResponse } from "@/types/api";
import type {
  AuthSuccessData,
  LoginRequest,
  SignupRequest,
  Tokens,
} from "../types/auth-api.types";

export const loginApi = async (
  payload: LoginRequest,
): Promise<AuthSuccessData> => {
  const response = await apiFetch<AuthSuccessData>({
    api: "auth",
    url: "login",
    options: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  });

  if (!response.data?.tokens?.accessToken || !response.data?.user) {
    throw new ApiError(
      "Failed to login: Incomplete authentication data received from server",
      500,
      undefined,
      response.data,
    );
  }

  return response.data;
};

export const signupApi = async (
  payload: SignupRequest,
): Promise<AuthSuccessData> => {
  const response = await apiFetch<AuthSuccessData>({
    api: "auth",
    url: "signup",
    options: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  });

  if (!response.data?.tokens?.accessToken || !response.data?.user) {
    throw new ApiError(
      "Failed to signup: Incomplete authentication data received from server",
      500,
      undefined,
      response.data,
    );
  }

  return response.data;
};

export const getMeApi = async (
  accessToken?: string,
): Promise<ApiResponse<UserResponse>> => {
  return await apiAuthFetch<UserResponse>({
    api: "auth",
    url: "me",
    options: {
      method: "GET",
      ...(accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {}),
    },
  });
};

export const validateTokenApi = getMeApi;

export const refreshTokensApi = async (
  refreshToken: string,
): Promise<Tokens> => {
  const response = await apiFetch<AuthSuccessData>({
    api: "auth",
    url: "refresh",
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  });

  if (!response.data?.tokens?.accessToken) {
    throw new ApiError(
      "Failed to refresh session: Missing access token from server",
      401,
      undefined,
      response.data,
    );
  }

  return response.data.tokens;
};
