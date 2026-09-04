import { useSnapDraft } from "@/features/snaps/context/snap-store";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, Text } from "react-native";

export default function DiscardFormButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const clearSnaps = useSnapDraft((state) => state.clearSnaps);
  const handleDiscardSnap = () => {
    Alert.alert(
      t("snaps.compose.discardTitle"),
      t("snaps.compose.discardBody"),
      [
        {
          text: t("snaps.compose.discardConfirm"),
          style: "destructive",
          onPress: () => {
            clearSnaps();
            router.replace("/");
          },
        },
        {
          text: t("snaps.actions.cancel"),
          style: "cancel",
        },
      ],
    );
  };
  return (
    <Pressable onPressIn={handleDiscardSnap} hitSlop={10}>
      <Text className="text-sm font-medium text-error">
        {t("snaps.compose.discard")}
      </Text>
    </Pressable>
  );
}
