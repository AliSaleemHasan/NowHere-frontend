import NowHereError from "@/components/Nowhere-Error";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

export const ErrorBoundary = NowHereError;

function PrivacySection({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <View className="mt-5">
      <Text className="text-base font-semibold text-primary">{title}</Text>
      <Text className="mt-2 text-sm leading-5 text-gray-600">{body}</Text>
    </View>
  );
}

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="px-5 pb-10 pt-4"
    >
      <Text className="text-2xl font-semibold text-primary">
        {t("privacy.heading")}
      </Text>
      <Text className="mt-3 text-sm leading-5 text-gray-600">
        {t("privacy.intro")}
      </Text>
      <PrivacySection
        title={t("privacy.whoTitle")}
        body={t("privacy.whoBody")}
      />
      <PrivacySection
        title={t("privacy.dataTitle")}
        body={t("privacy.dataBody")}
      />
      <PrivacySection
        title={t("privacy.locationTitle")}
        body={t("privacy.locationBody")}
      />
      <PrivacySection
        title={t("privacy.mailTitle")}
        body={t("privacy.mailBody")}
      />
      <PrivacySection
        title={t("privacy.rightsTitle")}
        body={t("privacy.rightsBody")}
      />
      <PrivacySection
        title={t("privacy.contactTitle")}
        body={t("privacy.contactBody")}
      />
    </ScrollView>
  );
}
