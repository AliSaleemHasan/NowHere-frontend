import { useUserStore } from "@/features/users/context/user-store";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";
import type { Tokens } from "../types/auth-api.types";

interface AuthState {
  isLoggedIn: boolean;
  tokens?: Tokens;
  _hasHydrated: boolean;

  setHasHydrated: (state: boolean) => void;
  setAuth: (tokens: Tokens) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (tokens: Tokens) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const ACCESS_TOKEN_KEY =
  process.env.EXPO_PUBLIC_ACCESS_TOKEN_KEY || "access_token";
export const REFRESH_TOKEN_KEY =
  process.env.EXPO_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token";

// Helper extracted to follow the DRY principle
const saveTokensToStorage = async (tokens: Tokens) => {
  await Promise.all([
    setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
};

export const useAuth = create<AuthState>((set) => ({
  _hasHydrated: false,
  setHasHydrated: (state) => set({ _hasHydrated: state }),
  tokens: undefined,
  isLoggedIn: false,

  hydrate: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        getItemAsync(ACCESS_TOKEN_KEY),
        getItemAsync(REFRESH_TOKEN_KEY),
      ]);

      if (accessToken && refreshToken) {
        set({
          tokens: { accessToken, refreshToken },
        });
      }
    } catch (error) {
      console.error("Failed to load tokens from storage", error);
    } finally {
      set({ _hasHydrated: true });
    }
  },

  setAuth: async (tokens) => {
    await saveTokensToStorage(tokens);
    set({
      isLoggedIn: true,
      tokens,
    });
  },

  logout: async () => {
    await Promise.all([
      deleteItemAsync(ACCESS_TOKEN_KEY),
      deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
    useUserStore.getState().clearUser();
    set({ isLoggedIn: false, tokens: undefined });
  },

  setTokens: async (tokens) => {
    await saveTokensToStorage(tokens);
    set({ tokens });
  },
}));

