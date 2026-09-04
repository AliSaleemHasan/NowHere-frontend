import { SafeScreen } from "@/components/SafeScreen";
import { resetToHome } from "@/lib/navigation";
import { ErrorBoundaryProps, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";

const NowHereError = ({ retry }: ErrorBoundaryProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <SafeScreen
      edges={["top", "bottom"]}
      className="max-w-md items-center justify-center gap-4 bg-red-50"
    >
      <View className="w-44 h-44 relative  ">
        <Image
          className="w-full h-full rounded-full"
          source={require("@/assets/images/logo-error.png")}
          alt={t("common.error")}
        />
      </View>
      <Text className=" text-wrap ">{t("errors.generic")}</Text>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={t("common.tryAgain")}
        onPress={retry}
        className="rounded-md bg-red-500 p-3"
      >
        <Text className="color-white">{t("common.tryAgain")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="error-back-to-map"
        accessibilityRole="button"
        accessibilityLabel={t("common.backToMap")}
        onPress={() => resetToHome(router)}
        className="p-2"
      >
        <Text className="text-sm text-gray-600">{t("common.backToMap")}</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default NowHereError;
