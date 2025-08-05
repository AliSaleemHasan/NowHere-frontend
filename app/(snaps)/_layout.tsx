import { Stack } from "expo-router";
import React from "react";

export default function SnapsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          headerShown: false,
          animation: "none",
          presentation: "modal",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
