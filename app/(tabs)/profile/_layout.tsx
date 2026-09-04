import LogoutButton from "@/features/auth/components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("profile.title"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerRight: () => (
            <Link href="/(tabs)/profile/settings" className="p-1">
              <Ionicons name="settings-outline" size={20} />
            </Link>
          ),
        }}
      />

      <Stack.Screen
        name="my-snaps"
        options={{
          title: t("snaps.mySnaps.title"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        }}
      />

      <Stack.Screen
        name="saved"
        options={{
          title: t("snaps.saved.title"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: t("profile.settingsTitle"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerRight: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
