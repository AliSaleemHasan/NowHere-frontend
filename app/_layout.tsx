import Loading from "@/components/loading";
import LocationRequired from "@/components/location-required";
import UserLocationProvider, {
  useUserLocation,
} from "@/context/user-location-context";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "./global.css";

export default function RootLayout() {
  return (
    <UserLocationProvider>
      <LocationDependentContent />
    </UserLocationProvider>
  );
}

function LocationDependentContent() {
  const { state, fetchLocation } = useUserLocation();
  useEffect(() => {
    fetchLocation();
  }, []);

  if (state.isLoading) return <Loading></Loading>;
  if (state.error) return <LocationRequired />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
