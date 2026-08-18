import { UserResponse } from "@/types/api";

export type LoginRequest = {
  email: string;
  password: string;
};

// Kept for backward compatibility
export type LoginFormProps = LoginRequest | {
  user: LoginRequest;
};

export type SignupRequest = {
  email: string;
  password: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSuccessData = {
  user: UserResponse;
  tokens: Tokens;
};

export type AuthSuccess = AuthSuccessData;

export type ValidateTokenData = {
  valid: boolean;
  userId: string;
};

