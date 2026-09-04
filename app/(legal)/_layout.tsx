import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";

export default function LegalLayout() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 16, fontWeight: "600" },
        headerLeft: () => (
          <Pressable
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
                return;
              }
              router.replace("/");
            }}
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
