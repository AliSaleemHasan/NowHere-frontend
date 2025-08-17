import { Stack } from "expo-router";
import React from "react";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "profile", headerShown: false }}
      ></Stack.Screen>

      <Stack.Screen name="settings"></Stack.Screen>
    </Stack>
  );
}
