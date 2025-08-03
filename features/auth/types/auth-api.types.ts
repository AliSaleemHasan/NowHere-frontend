import { User } from "@/types/api";

export type LoginFormProps = {
  user: {
    email: string;
    password: string;
  };
};

export type LoginSuccessData = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};
