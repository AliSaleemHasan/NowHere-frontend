import type { UserResponse } from "@/types/api";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Tokens } from "../types/auth-api.types";

interface AuthState {
  isLoggedIn: boolean;
  user?: UserResponse["Id"];
  tokens?: Tokens;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  setAuth: (user: UserResponse["Id"] | undefined, tokens: Tokens) => void;
  logout: () => Promise<void>;
  setTokens: (tokens: Tokens) => void;
}

const ACCESS_TOKEN_KEY =
  process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
const REFRESH_TOKEN_KEY =
  process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token";

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      tokens: undefined,
      isLoggedIn: false,
      user: undefined,

      setAuth: (user, tokens) =>
        set({
          isLoggedIn: true,
          user,
          tokens,
        }),

      logout: async () => {
        await Promise.all([
          deleteItemAsync(ACCESS_TOKEN_KEY),
          deleteItemAsync(REFRESH_TOKEN_KEY),
        ]);
        set({ isLoggedIn: false, user: undefined, tokens: undefined });
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
      onRehydrateStorage: () => (state) => {
        if (!state?.tokens?.accessToken) {
          useAuth.setState({
            isLoggedIn: false,
            tokens: undefined,
            user: undefined,
          });
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
