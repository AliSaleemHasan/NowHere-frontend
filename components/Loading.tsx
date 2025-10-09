import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface Props {
  cause?: string;
}
const Loading = (props: Props) => {
  return (
    <View className="flex gap-4 items-center justify-center w-full h-full bg-background/20 backdrop-blur-lg">
      <ActivityIndicator
        size={35}
        className="animate-spin font-bold"
        color={"purble"}
      />

      {props.cause && (
        <Text className="text-xs text-gray-600 animate-pulse">
          {props.cause}
        </Text>
      )}
    </View>
  );
};

export default Loading;
