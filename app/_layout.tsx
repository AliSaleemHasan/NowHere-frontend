import Loading from "@/components/loading";
import LocationRequired from "@/components/location-required";
import { useAuth } from "@/features/auth/context/auth-store";
import { useLocation } from "@/features/snaps/context/location-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "./global.css";

// Define Tanstack react query Client
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
export default function RootLayout() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LocationDependentContent />
      </QueryClientProvider>
      <Toast />
    </>
  );
}

function LocationDependentContent() {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  const init = useAuth((state) => state.init);

  const fetchLocation = useLocation((state) => state.featchLocation);
  const isLocationLoading = useLocation((state) => state.loading);
  const isLocationError = useLocation((state) => state.error);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    const handleInitAuth = async () => {
      await init();
    };
    handleInitAuth();
  }, []);

  if (isLocationLoading) return <Loading></Loading>;
  if (isLocationError) return <LocationRequired />;

  return (
    <Stack>
      <Stack.Protected guard={!isLocationError && !isLocationLoading}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false, presentation: "modal" }}
      />
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="(snaps)"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack.Protected>
    </Stack>
  );
}
