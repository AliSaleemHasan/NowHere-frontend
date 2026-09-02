//
// General API Types
//

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
  path?: string;
}

export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  timestamp?: string;
  errors?: string[];
  [key: string]: any;
}

export type HeaderContentType = "json" | "files" | "text" | "html";

export type FetchResponse<T> = ApiResponse<T>;


//
// Users
//

export type UserResponse = {
  id: string;
  email: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  userImage?: string;
  role?: string;
  isActive?: boolean;
  lastLoginAt?: Date | string;
};

export type GetUserResponse = {
  user: UserResponse;
  userImage?: string;
};

//
// Snaps
//

export type AddSnapRequest = {
  description: string;
  snaps: Array<string>;
};


