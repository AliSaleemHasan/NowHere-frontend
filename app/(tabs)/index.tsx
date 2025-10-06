import { View } from "react-native";

import NowHereMap from "@/components/NowHereMap";
import { useIsFocused } from "@react-navigation/native";
import React from "react";
export default function Index() {
  const isFocused = useIsFocused();

  return (
    <View className="flex-1 relative">
      {isFocused ? <NowHereMap /> : <></>}
    </View>
  );
}
