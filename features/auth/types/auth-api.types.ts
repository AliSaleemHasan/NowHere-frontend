import type { AuthIdentity, AuthUser, Tokens } from "@/types/api";

export type { Tokens };

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type AuthSuccessData = {
  user: AuthUser;
  tokens: Tokens;
};

export type MeResponse = AuthIdentity;
