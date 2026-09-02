import { UserResponse } from "@/types/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
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

export type ValidateTokenData = UserResponse;

