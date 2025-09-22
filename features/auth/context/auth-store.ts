import type { UserResponse } from "@/types/api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AuthSuccess,
  LoginFormProps,
  Tokens,
} from "../types/auth-api.types";

interface AuthState {
  isLoggedIn: boolean;
  isReady: boolean;
  user?: UserResponse["Id"];
  tokens?: Tokens;

  init: () => Promise<void>;
  login: (inputs: LoginFormProps) => Promise<AuthSuccess["user"]>;
  logout: () => Promise<void>;
  setTokens: (tokens: Tokens) => void;
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
          set({ isReady: true, isLoggedIn: false });
          return;
        }

        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_USERS_URL}/auth/validate`,
            {
              method: "GET",

              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          set({ isReady: true });

          let res = await response.json();

          if (res.success) {
            set({
              isLoggedIn: true,
              user: res.data.user.Id,
              tokens: res.data.tokens,
            });
          }
        } catch (error) {
          set({
            isLoggedIn: true,
            user: undefined,
            tokens: undefined,
          });
        }
      },

      login: async (inputs) => {
        const ressponse = await fetch(
          `${process.env.EXPO_PUBLIC_USERS_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(inputs),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        let res = await ressponse.json();
        if (!res.success) throw new Error(res.message);

        set({
          isLoggedIn: true,
          user: res.data.user.Id,
          tokens: res.data.tokens,
        });
        return res.data.user;
      },

      logout: async () => {
        await deleteItemAsync(ACCESS_TOKEN_KEY);
        await deleteItemAsync(REFRESH_TOKEN_KEY);
        set({ isLoggedIn: false, user: undefined });
      },
      setTokens: (tokens) => {
        set(() => ({ tokens }));
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
