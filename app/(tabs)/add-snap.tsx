import { useAuthContext } from "@/features/auth/context/auth-context";
import { Redirect } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function AddSnap() {
  const { loggedIn } = useAuthContext();
  if (!loggedIn)
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
