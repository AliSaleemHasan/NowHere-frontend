import React, { FC, ReactNode } from "react";
import { Text, View } from "react-native";

interface Props {
  children: ReactNode;
}
const Divider: FC<Props> = ({ children }) => {
  return (
    <View className="relative flex-row  flex py-2 items-center">
      <View className="flex-grow border-t border-gray-400"></View>
      <Text className="flex-shrink mx-4 text-gray-500">{children}</Text>
      <View className="flex-grow border-t border-gray-400"></View>
    </View>
  );
};

export default Divider;
