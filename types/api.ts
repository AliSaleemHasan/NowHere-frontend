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
