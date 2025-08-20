import { useAuth } from "@/features/auth/context/auth-store";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable } from "react-native";

export default function HeaderLogooutButton() {
  const logout = useAuth((state) => state.logout);

  const handleLogout = () => {
    Alert.alert("Logout from NowHere", "Are you sure you want to logout!", [
      {
        style: "cancel",
        text: "Cancel",
      },
      {
        style: "default",
        text: "Logout",
        onPress: logout,
      },
    ]);
  };

  return (
    <Pressable onPress={handleLogout} hitSlop={10}>
      <Ionicons size={20} name="log-out" />
    </Pressable>
  );
}
