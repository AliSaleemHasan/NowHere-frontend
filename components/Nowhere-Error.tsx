import { ErrorBoundaryProps } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

const NowHereError = ({ retry }: ErrorBoundaryProps) => {
  const { t } = useTranslation();
  return (
    <View className="flex-1 items-center justify-center max-w-md  gap-4 bg-red-50">
      <View className="w-44 h-44 relative  ">
        <Image
          className="w-full h-full rounded-full"
          source={require("@/assets/images/logo-error.png")}
          alt={t("common.error")}
        />
      </View>
      <Text className=" text-wrap ">{t("errors.generic")}</Text>
      <Text onPress={retry} className="bg-red-500 color-white p-3 rounded-md">
        {t("common.tryAgain")}
      </Text>
    </View>
  );
};

export default NowHereError;
