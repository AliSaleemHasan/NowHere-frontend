import { fetchWithoutAuth } from "@/lib/fetch-api";
import type { User } from "@/types/api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  LoginFormProps,
  LoginSuccessData,
  Tokens,
} from "../types/auth-api.types";

interface AuthState {
  isLoggedIn: boolean;
  isReady: boolean;
  user?: User;
  tokens?: Tokens;
  init: () => Promise<void>;
  login: (inputs: LoginFormProps) => Promise<LoginSuccessData["user"]>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      isReady: false,
      user: undefined,

      init: async () => {
        const token = get().tokens;
        if (!token?.accessToken) {
          set({ isReady: true });
          return;
        }

        const res = await fetchWithoutAuth<User>({
          url: "auth/validate",
          options: {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        });

        set({ isReady: true });
        if (res.success) {
          set({ isLoggedIn: true, user: res.data });
        }
      },

      login: async (inputs) => {
        const res = await fetchWithoutAuth<LoginSuccessData>({
          url: "auth/login",
          options: {
            method: "POST",
            body: JSON.stringify(inputs),
          },
        });
        if (!res.success) throw new Error(res.message);

        set({ isLoggedIn: true, user: res.data.user, tokens: res.data.tokens });
        return res.data.user;
      },

      logout: async () => {
        await deleteItemAsync(ACCESS_TOKEN_KEY);
        await deleteItemAsync(REFRESH_TOKEN_KEY);
        set({ isLoggedIn: false, user: undefined });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        getItem: getItemAsync,
        setItem: (key, value) => setItemAsync(key, value),
        removeItem: (key) => deleteItemAsync(key),
      })),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        tokens: state.tokens,
      }),
    }
  )
);
