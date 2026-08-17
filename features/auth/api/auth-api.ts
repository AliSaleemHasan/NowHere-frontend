import { apiFetch } from "@/lib/fetch-api";
import type { AuthSuccess, LoginFormProps } from "../types/auth-api.types";

export const loginApi = async (
  inputs: LoginFormProps
): Promise<AuthSuccess> => {
  const response = await apiFetch<AuthSuccess>({
    api: "users",
    url: "auth/login",
    options: {
      method: "POST",
      body: JSON.stringify(inputs),
    },
  });

  if (!response.data) {
    throw new Error(response.message || "Failed to log in");
  }

  return response.data;
};

export const validateTokenApi = async (
  token: string
): Promise<AuthSuccess> => {
  const response = await apiFetch<AuthSuccess>({
    api: "users",
    url: "auth/validate",
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  if (!response.data) {
    throw new Error(response.message || "Invalid token");
  }

  return response.data;
};
