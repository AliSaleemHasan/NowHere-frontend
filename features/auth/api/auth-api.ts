import { apiAuthFetch, apiFetch } from "@/lib/fetch-api";
import type { ApiResponse } from "@/types/api";
import type {
  AuthSuccessData,
  LoginFormProps,
  LoginRequest,
  SignupRequest,
  Tokens,
  ValidateTokenData,
} from "../types/auth-api.types";

export const loginApi = async (
  inputs: LoginFormProps,
): Promise<AuthSuccessData> => {
  // Support both flat { email, password } and legacy { user: { email, password } }
  const payload: LoginRequest =
    "user" in inputs && inputs.user ? inputs.user : (inputs as LoginRequest);

  const response = await apiFetch<AuthSuccessData>({
    api: "auth",
    url: "auth/login",
    options: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  });

  const authData = response?.data;

  if (!authData?.tokens || !authData?.user) {
    throw new Error("Failed to log in: Invalid response structure");
  }

  return authData;
};

export const signupApi = async (
  inputs: SignupRequest,
): Promise<AuthSuccessData> => {
  const payload: SignupRequest = {
    email: inputs.email,
    password: inputs.password,
    firstName: inputs.firstName,
    lastName: inputs.lastName,
    ...(inputs.username ? { username: inputs.username } : {}),
  };

  const response = await apiFetch<AuthSuccessData>({
    api: "auth",
    url: "auth/signup",
    options: {
      method: "POST",
      body: JSON.stringify(payload),
    },
  });

  const authData = response?.data;

  if (!authData?.tokens || !authData?.user) {
    throw new Error("Failed to sign up: Invalid response structure");
  }

  return authData;
};

export const validateTokenApi = async (
  accessToken: string,
): Promise<ApiResponse<ValidateTokenData>> => {
  return await apiAuthFetch<ValidateTokenData>({
    api: "auth",
    url: "auth/validate",
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
};

export const refreshTokensApi = async (refreshToken: string): Promise<Tokens> => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_AUTH_URL}/auth/refresh`,
    {
      method: "GET",
      headers: {
        Accept: "application/json, application/problem+json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    },
  );

  const rawText = await response.text();
  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = response.ok ? { success: true, data: rawText } : { success: false, detail: rawText };
  }

  if (!response.ok || (data && typeof data === "object" && data.success === false)) {
    throw new Error(data?.detail || data?.message || "Failed to refresh authentication token");
  }

  const payload = data && typeof data === "object" && "data" in data ? data.data : data;
  const newAccessToken =
    typeof payload === "string"
      ? payload
      : payload?.token || payload?.accessToken || payload?.tokens?.accessToken;
  const newRefreshToken =
    payload?.refreshToken || payload?.tokens?.refreshToken || refreshToken;

  if (!newAccessToken) {
    throw new Error("Invalid refresh response: missing access token");
  }

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};


