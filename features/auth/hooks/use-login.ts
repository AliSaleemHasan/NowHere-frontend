import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";
import type { LoginFormProps } from "../types/auth-api.types";

export const useLogin = () => {
  const setAuth = useAuth((state) => state.setAuth);

  return useMutation({
    mutationFn: (inputs: LoginFormProps) => loginApi(inputs),
    onSuccess: (data) => {
      const userId = data.user?.id;
      setAuth(userId, data.tokens);
    },
  });
};

