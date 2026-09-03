import { patchUser } from "@/features/users/context/user-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { getMeApi } from "../api/auth-api";
import { useAuth } from "../context/auth-store";
import { ApiError } from "@/lib/http/api-error";

export const useAuthSession = () => {
  const hasHydrated = useAuth((state) => state._hasHydrated);
  const tokens = useAuth((state) => state.tokens);
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const logout = useAuth((state) => state.logout);
  const hydrate = useAuth((state) => state.hydrate);

  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hasHydrated) return;

    let cancelled = false;

    const verifySession = async () => {
      if (!isLoggedIn || !tokens?.accessToken) {
        if (!cancelled) setIsValidating(false);
        await SplashScreen.hideAsync();
        return;
      }

      try {
        const me = await getMeApi(tokens.accessToken);
        if (cancelled) return;
        patchUser({
          id: me.id,
          email: me.email,
          role: me.role,
        });
      } catch (err: unknown) {
        if (cancelled) return;
        const unauthorized =
          err instanceof ApiError && err.statusCode === 401;
        if (unauthorized) {
          console.warn("Session expired or invalid, logging out:", err);
          await logout();
        } else {
          console.warn(
            "Could not reach auth server, keeping offline session:",
            err,
          );
        }
      } finally {
        if (!cancelled) setIsValidating(false);
        await SplashScreen.hideAsync();
      }
    };

    verifySession();
    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isLoggedIn, tokens?.accessToken, logout]);

  return { isReady: hasHydrated && !isValidating };
};
