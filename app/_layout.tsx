import { useAuth } from "@/features/auth/context/auth-store";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import {
  hasLocationConsent,
  useLocation,
} from "@/features/snaps/context/location-store";
import { i18n } from "@/lib/i18n";
import {
  retryDelayBackoff,
  retryUnlessClientError,
} from "@/lib/query-retry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { preventAutoHideAsync } from "expo-splash-screen";
import { I18nextProvider } from "react-i18next";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import "./global.css";

preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: retryUnlessClientError,
      retryDelay: retryDelayBackoff,
    },
  },
});

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
export default function RootLayout() {
  const { isReady } = useAuthSession();
  if (!isReady) {
    return null;
  }
  return (
    <I18nextProvider i18n={i18n}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <LocationDependentContent />
        </QueryClientProvider>
        <Toast />
      </KeyboardProvider>
    </I18nextProvider>
  );
}

function LocationDependentContent() {
  const boarding = useLocation((state) => state.boarding);
  const locationConsentAt = useLocation((state) => state.locationConsentAt);
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const consented = hasLocationConsent(locationConsentAt);

  return (
    <Stack>
      <Stack.Screen
        name="(legal)"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Protected guard={boarding && consented}>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="(snaps)"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack.Protected>

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false, presentation: "modal" }}
          />
        </Stack.Protected>
      </Stack.Protected>
      <Stack.Protected guard={boarding && !consented}>
        <Stack.Screen
          name="location-consent"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!boarding}>
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
