import { useAuth } from "@/features/auth/context/auth-store";
import { Redirect } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function AddSnap() {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn)
    return (
      <Redirect
        href={{ pathname: "/(auth)/login", params: { origin: "/add-snap" } }}
      />
    );
  return (
    <View>
      <Text>AddSnap</Text>
    </View>
  );
}
