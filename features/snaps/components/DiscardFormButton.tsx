import { useSnapDraft } from "@/features/snaps/context/snap-store";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, Text } from "react-native";

export default function DiscardFormButton() {
  const router = useRouter();
  const clearSnaps = useSnapDraft((state) => state.clearSnaps);
  const handleDiscardSnap = () => {
    Alert.alert(
      "Discard this snap?",
      "If you continue, your current snap and any changes will be lost.",
      [
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            clearSnaps();
            router.replace("/");
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };
  return (
    <Pressable onPressIn={handleDiscardSnap} hitSlop={10}>
      <Text className="text-sm font-medium text-error">Discard</Text>
    </Pressable>
  );
}
