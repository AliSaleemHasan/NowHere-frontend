import { fetchWithoutAuth } from "@/lib/fetch-api";
import { AuthContextState } from "@/types/contexts.types";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/utils";
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoginFormProps, LoginSuccessData } from "../types/auth-api.types";
export { deleteItemAsync } from "expo-secure-store";
export const AuthContext = createContext<AuthContextState>({
  loggedIn: false,
  isReady: false,
  login: (inputs: LoginFormProps) => {},
  logout: () => {},
});
export default function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { origin } = useLocalSearchParams<{ origin?: RelativePathString }>();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Bootstrap auth state
  useEffect(() => {
    (async () => {
      const token = await getItemAsync(ACCESS_TOKEN_KEY);
      setLoggedIn(!!token);
      setIsReady(true);
    })();
  }, []);

  const login = useCallback(
    async (inputs: LoginFormProps) => {
      const res = await fetchWithoutAuth<LoginSuccessData>({
        url: "auth/login",
        options: { method: "POST", body: JSON.stringify(inputs) },
      });

      if (!res.success) throw new Error(res.message);

      await setItemAsync(ACCESS_TOKEN_KEY, res.data.accessToken);
      await setItemAsync(REFRESH_TOKEN_KEY, res.data.refreshToken);

      setLoggedIn(true);
      router.replace({ pathname: origin ?? "/" });
    },
    [origin, router]
  );

  const logout = useCallback(async () => {
    await deleteItemAsync(ACCESS_TOKEN_KEY);
    await deleteItemAsync(REFRESH_TOKEN_KEY);
    setLoggedIn(false);
    // optionally: router.replace("/login");
  }, []);

  const value = useMemo<AuthContextState>(
    () => ({
      loggedIn,
      isReady,
      login,
      logout,
    }),
    [loggedIn, isReady, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
