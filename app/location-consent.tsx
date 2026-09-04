import NowHereError from "@/components/Nowhere-Error";
import { LocationConsentView } from "@/features/snaps/components/LocationConsentView";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ErrorBoundary = NowHereError;

export default function LocationConsentScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View
      className="flex-1 bg-background px-5"
      style={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 16,
      }}
    >
      <Text className="text-2xl font-semibold text-primary">
        {t("consent.upgradeTitle")}
      </Text>
      <Text className="mt-2 text-sm leading-5 text-gray-500">
        {t("consent.upgradeBody")}
      </Text>
      <View className="mt-6 flex-1">
        <LocationConsentView withErrorImage />
      </View>
    </View>
  );
}
