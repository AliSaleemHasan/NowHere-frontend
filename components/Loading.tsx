import React from "react";
import { Image, Text, View } from "react-native";

const Loading = () => {
  return (
    <View className="flex gap-4 items-center justify-center w-full h-full bg-white">
      <Image
        source={require("@/assets/images/icon.png")}
        alt="Logo-Loading"
        width={1}
        height={1}
        className={"animate-pulse flex-1 w-50 h-50"}
        resizeMode="contain"
      />

      <Text className="flex-[0.4] animate-pulse">Loading...</Text>
    </View>
  );
};

export default Loading;
