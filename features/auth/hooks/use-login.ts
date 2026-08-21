import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";
import type { LoginFormProps } from "../types/auth-api.types";

export const useLogin = () => {
  const setAuth = useAuth((state) => state.setAuth);

  return useMutation({
    mutationFn: async (inputs: LoginFormProps) => {
      const data = await loginApi(inputs);
      // Await setAuth so isLoggedIn is true before onSuccess navigation fires
      await setAuth(data.user?.id, data.tokens);
      return data;
    },
  });
};

