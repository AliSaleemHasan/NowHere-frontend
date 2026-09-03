import LogoutButton from "@/features/auth/components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
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
        name="settings"
        options={{
          title: "Settings",
          headerShadowVisible: false,
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerRight: () => <LogoutButton />,
        }}
      />
    </Stack>
  );
}
