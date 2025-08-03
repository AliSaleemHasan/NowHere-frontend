import { FetchResponse } from "@/types/api";
import { API_URL } from "@/utils";

type FetchParams = {
  options: RequestInit;
  url: string;
};

// This function is used to perform fetch request that does not require authentication
export const fetchWithoutAuth = async <T>({
  url,
  options,
}: FetchParams): Promise<FetchResponse<T>> => {
  if (!options) options = {};
  const existingHeaders = (options.headers ?? {}) as Record<string, string>;

  if (!existingHeaders["Content-Type"]) {
    options.headers = {
      ...existingHeaders,
      "Content-Type": "application/json",
    };
  }

  const res = await fetch(`${API_URL}${url}`, { ...options });

  let response = (await res.json()) as FetchResponse<T>;
  if (!response.success) return Promise.reject(new Error(response.message));
  return response;
};

// fetch with authentication

// export const fetchWithAuth = async <T>({
//   url,
//   options,
// }: FetchParams): Promise<FetchResponse<T>> => {
//   // first get the user data from storage
//   const accessToken = await getItemAsync(ACCESS_TOKEN_KEY);
//   if (!accessToken) {
//   }
//   // then do the request
//   //  if request is not ok  refresh the token
//   // if refresh token is ok refetch with the new token
//   // logout if the token is not ok
// };
