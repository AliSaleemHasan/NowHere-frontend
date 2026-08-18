import type { Tokens } from "@/features/auth/types/auth-api.types";

/**
 * Interface responsible solely for reading, writing, and clearing tokens in state/storage.
 * (Single Responsibility Principle: State Management / Persistence)
 */
export interface ITokenStorage {
  getTokens(): Tokens | undefined;
  setTokens(tokens: Tokens): Promise<void>;
  clearTokens(): Promise<void>;
}

/**
 * Delegate function responsible for calling the refresh API endpoint.
 * (Single Responsibility Principle: Network / Transport)
 */
export type TokenRefresher = (refreshToken: string) => Promise<Tokens>;

/**
 * High-level interface consumed by HttpClient.
 */
export interface ITokenProvider extends ITokenStorage {
  refreshToken(refreshToken: string): Promise<Tokens>;
}
