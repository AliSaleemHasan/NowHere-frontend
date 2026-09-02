import { setUser } from "@/features/users/context/user-store";
import { useMutation } from "@tanstack/react-query";
import { signupApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";
import type { SignupRequest } from "../types/auth-api.types";

export const useSignup = () => {
  const setAuth = useAuth((state) => state.setAuth);

  return useMutation({
    mutationFn: async (inputs: SignupRequest) => {
      const data = await signupApi(inputs);
      await setAuth(data.tokens);
      setUser(data.user);
      return data;
    },
  });
};
