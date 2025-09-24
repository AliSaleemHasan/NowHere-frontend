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
  firstName: string;
  lastName: string;
  Id: string;
  image?: string;
};

export type GetUserResponse = {
  user: UserResponse;
  userImage?: string;
};

//
//  SNAPS
//

export type AddSnapRequest = {
  description: string;
  snaps: Array<string>;
};
