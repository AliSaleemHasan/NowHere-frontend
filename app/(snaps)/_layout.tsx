import BackToHome from "@/components/back-to-home";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export default function SnapsLayout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="snaps-capture"
        options={{
          title: "New Snap",
          headerTitleStyle: { fontSize: 14 },
          headerTitleAlign: "center",
          headerLeft: () => <BackToHome />,
          headerRight: () => (
            <Pressable onPressIn={() => router.push("/(snaps)/snap-inputs")}>
              <Text className="text-lg text-blue-700 ">Next</Text>
            </Pressable>
          ),
          animation: "none",
          presentation: "modal",
        }}
      ></Stack.Screen>

      <Stack.Screen
        name="snap-inputs"
        options={{
          title: "New Snap",
          headerTitleStyle: { fontSize: 14 },
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable onPressIn={() => router.back()}>
              <FontAwesome name="backward" size={20} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPressIn={() => router.replace("/")}>
              <Text className="font-thin"> Discard</Text>
            </Pressable>
          ),
          animation: "none",
          presentation: "modal",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
