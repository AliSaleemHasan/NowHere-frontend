import { useAuth } from "@/features/auth/context/auth-store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable } from "react-native";

export function confirmLogout(onLogout: () => void) {
  Alert.alert("Log out of NowHere?", "You can sign back in at any time.", [
    { text: "Cancel", style: "cancel" },
    { text: "Log out", style: "destructive", onPress: onLogout },
  ]);
}

export default function LogoutButton() {
  const logout = useAuth((state) => state.logout);

  return (
    <Pressable onPress={() => confirmLogout(logout)} hitSlop={10}>
      <Ionicons size={20} name="log-out-outline" />
    </Pressable>
  );
}
