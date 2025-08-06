import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export default function BackToHome() {
  const router = useRouter();
  return (
    <Pressable onPressIn={() => router.replace("/")}>
      <Text className="text-lg font-extralight">X</Text>
    </Pressable>
  );
}
