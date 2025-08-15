import { UserResponse } from "@/types/api";

export type LoginFormProps = {
  user: {
    email: string;
    password: string;
  };
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthSuccess = {
  user: UserResponse;
  tokens: Tokens;
};
