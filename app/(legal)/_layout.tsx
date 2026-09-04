import { hasLocationConsent, useLocation } from "@/features/snaps/context/location-store";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";

function closeLegal(router: ReturnType<typeof useRouter>) {
  if (router.canDismiss()) {
    router.dismiss();
    return;
  }
  if (router.canGoBack()) {
    router.back();
    return;
  }
  const { boarding, locationConsentAt } = useLocation.getState();
  if (!boarding) {
    router.replace("/onboarding");
    return;
  }
  if (!hasLocationConsent(locationConsentAt)) {
    router.replace("/location-consent");
    return;
  }
  router.replace("/");
}

export default function LegalLayout() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        gestureEnabled: true,
        headerLeft: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("privacy.close")}
            hitSlop={16}
            onPressIn={() => closeLegal(router)}
            className="ml-4 p-3"
          >
            <FontAwesome name="close" size={15} color="black" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="privacy"
        options={{ title: t("privacy.title") }}
      />
    </Stack>
  );
}
