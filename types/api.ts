//
// General
//

export type HeaderContentType = "json" | "files" | "text" | "html";

export type Success<T> = {
  data: T;
  success: true;
};

export type ResponseError = {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  path: string;
};

export type FetchResponse<T> = ResponseError | Success<T>;

//
// Users
//
export type User = {
  email: string;
  bio?: string;
  first_name: string;
  last_name: string;
};

//
//  SNAPS
//

export type AddSnapRequest = {
  description: string;
  snaps: Array<string>;
};
