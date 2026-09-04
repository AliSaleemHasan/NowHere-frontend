import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

export default function Layout() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: false,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "white" },
        headerTitle: "",
        headerLeft: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
            hitSlop={16}
            onPressIn={() => router.replace("/")}
            className="ml-1 p-3"
          >
            <FontAwesome name="close" size={15} color="black" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
