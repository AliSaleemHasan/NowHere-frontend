import { useAuth } from "@/features/auth/context/auth-store";
import { i18n } from "@/lib/i18n";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable } from "react-native";

export function confirmLogout(onLogout: () => void) {
  Alert.alert(
    i18n.t("users.profile.logoutConfirmTitle"),
    i18n.t("users.profile.logoutConfirmBody"),
    [
      { text: i18n.t("users.profile.logoutCancel"), style: "cancel" },
      {
        text: i18n.t("users.profile.logout"),
        style: "destructive",
        onPress: onLogout,
      },
    ],
  );
}

export default function LogoutButton() {
  const logout = useAuth((state) => state.logout);

  return (
    <Pressable onPress={() => confirmLogout(logout)} hitSlop={10}>
      <Ionicons size={20} name="log-out-outline" />
    </Pressable>
  );
}
