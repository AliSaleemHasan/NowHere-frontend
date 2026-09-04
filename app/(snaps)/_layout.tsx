import DiscardFormButton from "@/features/snaps/components/DiscardFormButton";
import { leaveToHome } from "@/lib/navigation";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable } from "react-native";

export default function SnapsLayout() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="snaps-capture"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          presentation: "fullScreenModal",
        }}
      />

      <Stack.Screen
        name="snap-inputs"
        options={{
          title: t("snaps.compose.title"),
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable onPressIn={() => router.replace("/snaps-capture")}>
              <FontAwesome name="chevron-left" size={18} />
            </Pressable>
          ),
          headerRight: () => <DiscardFormButton />,
          animation: "none",
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="[id]"
        options={{
          title: t("snaps.details.screenTitle"),
          headerTitleStyle: { fontSize: 16, fontWeight: "600" },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f9fafb" },
          presentation: Platform.OS === "ios" ? "transparentModal" : "modal",
          animation: "slide_from_bottom",
          gestureDirection: "vertical",
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.close")}
              hitSlop={16}
              onPressIn={() => leaveToHome(router)}
              className="ml-4 p-3"
            >
              <FontAwesome name="close" size={15} color="black" />
            </Pressable>
          ),
          ...(Platform.OS === "ios" && {
            sheetGrabberVisible: true,
            sheetCornerRadius: 28,
            sheetInitialDetentIndex: 0,
            sheetAllowedDetents: [0.58, 0.92, 1],
            sheetExpandsWhenScrolledToEdge: true,
          }),
        }}
      />
    </Stack>
  );
}
