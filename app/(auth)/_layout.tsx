import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function Layout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        contentStyle: { backgroundColor: "white" },
        headerTitle: "",
        headerLeft: () => (
          <Pressable
            onPressIn={() => router.replace("/")}
            className="ml-4 p-3 "
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
