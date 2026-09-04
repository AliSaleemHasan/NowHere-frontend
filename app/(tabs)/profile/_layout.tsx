import LogoutButton from "@/features/auth/components/LogoutButton";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ProfileLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
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
          title: t("users.settings.title"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerRight: () => <LogoutButton />,
        }}
      />

      <Stack.Screen
        name="edit"
        options={{
          title: t("users.edit.title"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        }}
      />

      <Stack.Screen
        name="change-password"
        options={{
          title: t("users.password.title"),
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        }}
      />
    </Stack>
  );
}
