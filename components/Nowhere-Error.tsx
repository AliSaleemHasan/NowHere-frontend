import { ErrorBoundaryProps } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const NowHereError = ({ error, retry }: ErrorBoundaryProps) => {
  return (
    <View className="flex-1 items-center justify-center max-w-md  gap-4 bg-red-50">
      <View className="w-44 h-44 relative  ">
        <Image
          className="w-full h-full rounded-full"
          source={require("@/assets/images/logo-error.png")}
          alt="Error"
        />
      </View>
      <Text className=" text-wrap ">{error.message}</Text>
      <Text onPress={retry} className="bg-red-500 color-white p-3 rounded-md">
        Try Again?
      </Text>
    </View>
  );
};

export default NowHereError;
