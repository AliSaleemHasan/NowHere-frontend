import { useAuth } from "@/features/auth/context/auth-store";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const logout = useAuth((state) => state.logout);
  return (
    <View className="flex items-center justify-center h-full w-full bg-secondary">
      <TouchableOpacity
        className="bg-alert p-5 rounded-full w-1/2"
        onPress={logout}
      >
        <Text className="text-white text-center">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
