import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = () => {
  return (
    <View className="flex gap-4 items-center justify-center w-full h-full bg-background/20 backdrop-blur-lg">
      <ActivityIndicator
        size={35}
        className="animate-spin font-bold"
        color={"purble"}
      />
    </View>
  );
};

export default Loading;
