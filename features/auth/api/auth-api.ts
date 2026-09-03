import { apiAuthFetch, apiFetch } from "@/lib/fetch-api";
import { ApiError } from "@/lib/http/api-error";
import type { AuthUser } from "@/types/api";
import type {
  AuthSuccessData,
  LoginRequest,
  MeResponse,
  SignupRequest,
  Tokens,
} from "../types/auth-api.types";

async function postAuth(
  url: "login" | "signup",
  payload: LoginRequest | SignupRequest,
  incompleteMessage: string,
): Promise<AuthSuccessData> {
  const response = await apiFetch<AuthSuccessData>({
    api: "auth",
    url,
    options: {
      method: "POST",
      body: payload,
    },
  });

  if (!response.data?.tokens?.accessToken || !response.data?.user) {
    throw new ApiError(incompleteMessage, 500, undefined, response.data);
  }

  return response.data;
}

export const loginApi = (payload: LoginRequest): Promise<AuthSuccessData> =>
  postAuth(
    "login",
    payload,
    "Failed to login: Incomplete authentication data received from server",
  );

export const signupApi = (payload: SignupRequest): Promise<AuthSuccessData> =>
  postAuth(
    "signup",
    payload,
    "Failed to signup: Incomplete authentication data received from server",
  );

export const getMeApi = async (accessToken?: string): Promise<MeResponse> => {
  const response = await apiAuthFetch<MeResponse>({
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

  if (!response.data?.id || !response.data?.email) {
    throw new ApiError("Failed to load session identity", 500);
  }

  return {
    id: response.data.id,
    email: response.data.email,
    role: response.data.role ?? "USER",
  };
};

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

export function authUserToProfile(user: AuthUser) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt ?? null,
  };
}
