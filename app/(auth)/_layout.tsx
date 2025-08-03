import { useAuth } from "@/features/auth/context/auth-store";
import { Redirect, Stack } from "expo-router";

export default function Layout() {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  if (isLoggedIn) return <Redirect href={"/"}></Redirect>;
  return (
    <Stack>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="signup"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack.Protected>
    </Stack>
  );
}
