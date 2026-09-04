import { useAuth } from "@/features/auth/context/auth-store";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function AddSnap() {
  const { t } = useTranslation();
  const router = useRouter();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        router.replace("/(snaps)/snaps-capture");
      }
    }, [isLoggedIn, router]),
  );

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Ionicons name="camera" size={28} color="#ffffff" />
      </View>
      <Text className="mt-5 text-center text-2xl font-semibold text-primary">
        {t("snaps.add.title")}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
        {t("snaps.add.body")}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/login")}
        className="mt-6 rounded-full bg-primary px-6 py-3"
      >
        <Text className="font-semibold text-white">{t("snaps.add.signIn")}</Text>
      </TouchableOpacity>
    </View>
  );
}
