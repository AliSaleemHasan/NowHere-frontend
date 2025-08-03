import Loading from "@/components/loading";
import LocationRequired from "@/components/location-required";
import UserLocationProvider, {
  useUserLocation,
} from "@/context/user-location-context";
import { useAuth } from "@/features/auth/context/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

// Define Tanstack react query Client
const queryClient = new QueryClient();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserLocationProvider>
        <LocationDependentContent />
      </UserLocationProvider>
    </QueryClientProvider>
  );
}

function LocationDependentContent() {
  const init = useAuth((state) => state.init);

  const { state, fetchLocation } = useUserLocation();

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  if (state.isLoading) return <Loading></Loading>;
  if (state.error) return <LocationRequired />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false, presentation: "modal" }}
      />
    </Stack>
  );
}
