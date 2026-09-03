import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface Props {
  cause?: string;
}
const Loading = (props: Props) => {
  return (
    <View className="h-full w-full items-center justify-center gap-4 bg-background/20">
      <ActivityIndicator size={35} color="#0f0d23" />

      {props.cause && (
        <Text className="animate-pulse text-xs text-gray-600">
          {props.cause}
        </Text>
      )}
    </View>
  );
};

export default Loading;
