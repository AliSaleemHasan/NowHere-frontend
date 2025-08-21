import { useAuth } from "@/features/auth/context/auth-store";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function AddSnapRedirect() {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(isLoggedIn ? "/(snaps)/snaps-capture" : "/(auth)/login");
    }, 100);

    return () => clearTimeout(timeout);
  }, [isLoggedIn]);

  return <View></View>;
}
