import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function FoundBadge({ testID }: { testID?: string }) {
  const { t } = useTranslation();
  return (
    <View
      testID={testID ?? "snap-found-badge"}
      className="rounded-full bg-emerald-600 px-2 py-0.5"
    >
      <Text className="text-[10px] font-bold uppercase tracking-wide text-white">
        {t("snaps.resolution.found")}
      </Text>
    </View>
  );
}
