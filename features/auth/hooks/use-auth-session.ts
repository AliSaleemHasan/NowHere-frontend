import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { validateTokenApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";

export const useAuthSession = () => {
  const hasHydrated = useAuth((state) => state._hasHydrated);
  const tokens = useAuth((state) => state.tokens);
  const setAuth = useAuth((state) => state.setAuth);
  const logout = useAuth((state) => state.logout);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return;

    const verifySession = async () => {
      // 1. If no token in storage, ensure logged out
      if (!tokens?.accessToken) {
        await logout();
        setIsValidating(false);
        await SplashScreen.hideAsync();
        return;
      }

      // 2. Validate token against backend
      try {
        await validateTokenApi(tokens.accessToken);
      } catch (err: any) {
        if (
          err?.statusCode === 401 ||
          err?.message?.toLowerCase().includes("unauthorized")
        ) {
          console.warn("Session expired or invalid, logging out:", err);
          await logout();
        } else {
          console.warn(
            "Could not reach auth server during startup, retaining offline session:",
            err,
          );
        }
      } finally {
        setIsValidating(false);
        await SplashScreen.hideAsync();
      }
    };

    verifySession();
  }, [hasHydrated]);

  return { isReady: hasHydrated && !isValidating };
};
