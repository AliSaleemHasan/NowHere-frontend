export type LoginFormProps = {
  user: {
    email: string;
    password: string;
  };
};

export type LoginSuccessData = {
  accessToken: string;
  refreshToken: string;
};
