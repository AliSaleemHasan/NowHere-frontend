import { Text, TouchableHighlight, View } from "react-native";

type AuthRedirectPromptProps = {
  promptText: string; // e.g. "Don't have an account?"
  linkText: string; // e.g. "Sign up"
  onPress: () => void;
};

export function AuthRedirectPrompt({
  promptText,
  linkText,
  onPress,
}: AuthRedirectPromptProps) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-gray-500">{promptText}</Text>
      <TouchableHighlight onPress={onPress}>
        <Text className="text-xs text-gray-600">{linkText}</Text>
      </TouchableHighlight>
    </View>
  );
}
