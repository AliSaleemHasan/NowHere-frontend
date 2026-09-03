import { setUser } from "@/features/users/context/user-store";
import { useMutation } from "@tanstack/react-query";
import { authUserToProfile, loginApi, signupApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";
import type {
  AuthSuccessData,
  LoginRequest,
  SignupRequest,
} from "../types/auth-api.types";

export async function persistAuthSession(
  data: AuthSuccessData,
): Promise<void> {
  await useAuth.getState().setAuth(data.tokens);
  setUser(authUserToProfile(data.user));
}

export function useLogin() {
  return useMutation({
    mutationFn: async (inputs: LoginRequest) => {
      const data = await loginApi(inputs);
      await persistAuthSession(data);
      return data;
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: async (inputs: SignupRequest) => {
      const data = await signupApi(inputs);
      await persistAuthSession(data);
      return data;
    },
  });
}
