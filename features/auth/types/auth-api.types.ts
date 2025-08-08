import { User } from "@/types/api";

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
  user: User;
  tokens: Tokens;
};
