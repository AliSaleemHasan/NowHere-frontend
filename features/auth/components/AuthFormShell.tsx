import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AuthFormShell({ title, subtitle, children }: Props) {
  const { t } = useTranslation();

  return (
    <View className="w-full flex-1 items-center justify-center px-6 py-10">
      <Image
        accessibilityRole="image"
        accessibilityLabel={t("auth.brandA11y")}
        source={require("@/assets/images/icon.png")}
        className="h-16 w-16 rounded-2xl"
      />
      <Text className="mt-5 text-center text-2xl font-semibold text-primary">
        {title}
      </Text>
      {subtitle ? (
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
          {subtitle}
        </Text>
      ) : null}
      <View className="mt-8 w-full max-w-sm gap-4">{children}</View>
    </View>
  );
}
