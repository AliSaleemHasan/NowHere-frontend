//
// General
//

export type HeaderContentType = "json" | "files" | "text" | "html";

export type FetchResponse<T> = {
  data?: T;
  success: boolean;
  statusCode?: number;
  message?: string;
  error?: string;
  path?: string;
};

//
// Users
//
export type UserResponse = {
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
