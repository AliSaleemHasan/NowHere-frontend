import NowHereError from "@/components/Nowhere-Error";
import { resetToHome } from "@/lib/navigation";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export const ErrorBoundary = NowHereError;

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: t("notFound.title"), headerShown: true }} />
      <View
        testID="not-found"
        className="flex-1 items-center justify-center bg-gray-50 px-8"
      >
        <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <Ionicons name="map-outline" size={26} color="#0f0d23" />
        </View>
        <Text className="mt-4 text-center text-lg font-semibold text-primary">
          {t("notFound.title")}
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
          {t("notFound.body")}
        </Text>
        <TouchableOpacity
          testID="not-found-home"
          accessibilityRole="button"
          accessibilityLabel={t("common.backToMap")}
          onPress={() => resetToHome(router)}
          className="mt-6 rounded-full bg-primary px-6 py-3"
        >
          <Text className="font-semibold text-white">{t("common.backToMap")}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
