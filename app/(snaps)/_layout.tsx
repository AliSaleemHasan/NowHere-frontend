import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export default function SnapsLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="new"
        options={{
          title: "New Snap",
          headerTitleStyle: { fontSize: 14 },
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable onPressIn={() => router.replace("/")}>
              <Text className="text-lg font-extralight">X</Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              onPressIn={() => {
                router.replace("/");
              }}
            >
              <Text className="text-lg  text-blue-700">Done</Text>
            </Pressable>
          ),
          animation: "none",
          presentation: "modal",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
