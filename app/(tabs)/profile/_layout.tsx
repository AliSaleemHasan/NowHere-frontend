import HeaderLogooutButton from "@/components/HeaderLogooutButton";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Welcome Back",
          headerTitleStyle: { fontSize: 12, fontWeight: "100" },

          headerRight: () => (
            <Link href={"/(tabs)/profile/settings"}>
              <Ionicons name="settings" size={20}></Ionicons>
            </Link>
          ),
        }}
      ></Stack.Screen>

      <Stack.Screen
        name="settings"
        options={{
          headerRight: () => <HeaderLogooutButton />,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
