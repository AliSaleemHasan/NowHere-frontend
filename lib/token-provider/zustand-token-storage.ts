import { useAuth } from "@/features/auth/context/auth-store";
import type { Tokens } from "@/types/api";
import type { ITokenStorage } from "./token-provider.interface";

/**
 * Concrete Zustand adapter for token state persistence.
 * Adheres to SoC by containing zero HTTP/network logic.
 */
export class ZustandTokenStorage implements ITokenStorage {
  public getTokens(): Tokens | undefined {
    return useAuth.getState().tokens;
  }

  public async setTokens(tokens: Tokens): Promise<void> {
    await useAuth.getState().setTokens(tokens);
  }

  public async clearTokens(): Promise<void> {
    await useAuth.getState().logout?.();
  }
}
