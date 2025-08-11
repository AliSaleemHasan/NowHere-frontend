import { useAuth } from "@/features/auth/context/auth-store";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const logout = useAuth((state) => state.logout);
  const user = useAuth((state) => state.user);

  return (
    <SafeAreaView className="flex items-center justify-center h-full w-full bg-secondary p-5">
      <View className="flex-1 w-full flex  gap-4">
        <Text className="text-black">
          Welcome Back {user?.first_name} {user?.last_name}
        </Text>
        <Text className="text-black w-full">
          Your current email is: {user?.email}
        </Text>
      </View>
      <TouchableOpacity
        className="bg-alert p-5 rounded-full w-full"
        onPress={logout}
      >
        <Text className="text-white text-center">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
