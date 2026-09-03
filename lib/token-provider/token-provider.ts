import type { Tokens } from "@/types/api";
import type {
  ITokenProvider,
  ITokenStorage,
  TokenRefresher,
} from "./token-provider.interface";

/**
 * TokenProvider coordinates token storage and token refreshing delegates.
 */
export class TokenProvider implements ITokenProvider {
  constructor(
    private readonly storage: ITokenStorage,
    private readonly refresher: TokenRefresher,
  ) {}

  public getTokens(): Tokens | undefined {
    return this.storage.getTokens();
  }

  public async setTokens(tokens: Tokens): Promise<void> {
    await this.storage.setTokens(tokens);
  }

  public async clearTokens(): Promise<void> {
    await this.storage.clearTokens();
  }

  public async refreshToken(refreshToken: string): Promise<Tokens> {
    const newTokens = await this.refresher(refreshToken);
    await this.storage.setTokens(newTokens);
    return newTokens;
  }
}
