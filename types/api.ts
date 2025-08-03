export type Success<T> = {
  data: T;
  success: true;
};

export type Error = {
  success: false;
  status: string;
  message: string;
  path: string;
};

export type FetchResponse<T> = Error | Success<T>;
