import DiscardFormButton from "@/components/discard-form-button";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, Text } from "react-native";

export default function SnapsLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          title: "Snap Detail",
          presentation: Platform.OS === "ios" ? "transparentModal" : "modal",
          animation: "slide_from_bottom",
          gestureDirection: "vertical",
          ...(Platform.OS === "ios" && {
            sheetGrabberVisible: true,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: [0.3, 0.75, 1],
            sheetExpandsWhenScrolledToEdge: true,
          }),
        }}
      />

      <Stack.Screen
        name="snaps-capture"
        options={{
          title: "New Snap",
          headerTitleStyle: { fontSize: 14 },
          headerTitleAlign: "center",
          headerLeft: () => <DiscardFormButton />,
          headerRight: () => (
            <Pressable onPressIn={() => router.replace("/(snaps)/snap-inputs")}>
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
            <Pressable onPressIn={() => router.replace("/snaps-capture")}>
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
