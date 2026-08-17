import { useAuth } from "@/features/auth/context/auth-store";
import { useLocation } from "@/features/snaps/context/location-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast from "react-native-toast-message";
import "./global.css";

preventAutoHideAsync();

// Define Tanstack react query Client
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
export default function RootLayout() {
  const hasHydrated = useAuth((state) => state._hasHydrated);

  useEffect(() => {
    if (hasHydrated) {
      hideAsync();
    }
  }, [hasHydrated]);

  if (!hasHydrated) {
    return null;
  }
  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <LocationDependentContent />
      </QueryClientProvider>
      <Toast />
    </KeyboardProvider>
  );
}

function LocationDependentContent() {
  const init = useAuth((state) => state.init);
  const boarding = useLocation((state) => state.boarding);

  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  useEffect(() => {
    const handleInitAuth = async () => {
      await init();
    };
    handleInitAuth();
  }, []);

  return (
    <Stack>
      <Stack.Protected guard={boarding}>
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
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false, presentation: "modal" }}
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
