import { apiAuthFetch, apiFetch } from "@/lib/fetch-api";
import type { AuthSuccess, LoginFormProps } from "../types/auth-api.types";

export const loginApi = async (
  inputs: LoginFormProps,
): Promise<AuthSuccess> => {
  const response = await apiFetch<any>({
    api: "auth",
    url: "auth/login",
    options: {
      method: "POST",
      body: JSON.stringify(inputs),
    },
  });

  const authData = response?.data || response;

  if (!authData?.tokens || !authData?.user) {
    throw new Error(response?.message || "Failed to log in");
  }

  return authData as AuthSuccess;
};

export const validateTokenApi = async (accessToken: string): Promise<any> => {
  const response = await apiAuthFetch<any>({
    api: "auth",
    url: "auth/validate",
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  return response;
};
