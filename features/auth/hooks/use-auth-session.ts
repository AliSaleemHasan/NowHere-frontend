import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { validateTokenApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";

export const useAuthSession = () => {
  const hasHydrated = useAuth((state) => state._hasHydrated);
  const tokens = useAuth((state) => state.tokens);
  const logout = useAuth((state) => state.logout);
  const hydrate = useAuth((state) => state.hydrate);

  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const verifySession = async () => {
      try {
        if (!tokens?.accessToken) {
          await logout();
          return;
        }

        const validation = await validateTokenApi(tokens.accessToken);

        useAuth.setState({ isLoggedIn: true });
      } catch (err: any) {
        if (
          err?.statusCode === 401 ||
          err?.message?.toLowerCase().includes("unauthorized")
        ) {
          console.warn("Session expired or invalid, logging out:", err);
          await logout();
        } else {
          console.warn(
            "Could not reach auth server, keeping offline session:",
            err,
          );
          useAuth.setState({ isLoggedIn: true });
        }
      } finally {
        setIsValidating(false);
        await SplashScreen.hideAsync();
      }
    };

    verifySession();
  }, [hasHydrated]); // Only runs after hydrate() finishes

  return { isReady: hasHydrated && !isValidating };
};
