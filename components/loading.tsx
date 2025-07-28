import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View className="flex items-center justify-center w-full h-full">
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loading;
