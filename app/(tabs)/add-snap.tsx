// File: app/(tabs)/add-snap.tsx

import { useAuth } from "@/features/auth/context/auth-store";
import { Redirect } from "expo-router";

export default function AddSnapRedirect() {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  if (isLoggedIn) {
    // If the user is logged in, send them to the actual "new snap" screen.
    // The screen is located at /app/(snaps)/new.tsx
    // We use replace to avoid adding the dummy screen to the history.
    return <Redirect href="/(snaps)/snaps-capture" />;
  } else {
    // If the user is not logged in, send them to the login screen.
    // The screen is at /app/(auth)/login.tsx
    // The (auth) group is configured as a modal in the root layout, so this will present it modally.
    return <Redirect href="/(auth)/login" />;
  }
}
