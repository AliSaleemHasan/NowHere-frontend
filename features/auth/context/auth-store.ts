import { fetchWithoutAuth } from "@/lib/fetch-api";
import { User } from "@/types/api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils";
import { RelativePathString, useRouter } from "expo-router";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";
import { LoginFormProps, LoginSuccessData } from "../types/auth-api.types";

// first we need to create the type of auth state
export type AuthStoreState = {
  isLoggedIn: boolean; // to indicate if a user is logged in or not;
  isReady: boolean; // authentication is finished (to show log screen if not)
  user?: User;

  // function to perfrom for authetnication
  init: () => Promise<void>; // to set the initial values of authenticationStoreState
  login: (inputs: LoginFormProps, origin?: RelativePathString) => Promise<void>; // async function to perform login action
  logout: () => Promise<void>; // async function to perfrom logout action
  FacebookLogin: () => Promise<void>; // login using facebook TODO (this will be implemented later)
  GoogleLogin: () => Promise<void>; // login using gmail  TODO (This will be implemented later)
};
export const useAuth = create<AuthStoreState>((set) => {
  const router = useRouter();

  return {
    isLoggedIn: false,
    isReady: false,
    init: async () => {
      // see if the access token is already in the secure store

      const accessToken = await getItemAsync(ACCESS_TOKEN_KEY);
      if (!accessToken) return; // here the initial values will stay as defined

      // first check if the access Token is valid
      const response = await fetchWithoutAuth<User>({
        url: "auth/validate",

        options: {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      });

      // after fetching the data
      set(() => ({ isReady: true }));

      // get the refresh token and validate
      // (this will happen just in case of jwt expiration, and it will be checked upon in each request)
      if (!response.success) return;

      set(() => ({ user: response.data, isLoggedIn: true }));
    },
    logout: async () => {
      // setting all values to their initials
      set(() => ({ isLoggedIn: false, isReady: true, user: undefined }));
      // push the router to the home page
      router.replace("/");
    },
    login: async (inputs: LoginFormProps, origin?: RelativePathString) => {
      const res = await fetchWithoutAuth<LoginSuccessData>({
        url: "auth/login",
        options: { method: "POST", body: JSON.stringify(inputs) },
      });

      if (!res.success) throw new Error(res.message);

      await setItemAsync(ACCESS_TOKEN_KEY, res.data.tokens.accessToken);
      await setItemAsync(REFRESH_TOKEN_KEY, res.data.tokens.refreshToken);

      set(() => ({ isLoggedIn: true, user: res.data.user }));
      router.replace({ pathname: origin ?? "/" });
    },
    FacebookLogin: async () => {},
    GoogleLogin: async () => {},
  };
});
