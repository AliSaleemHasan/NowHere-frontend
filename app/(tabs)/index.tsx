import { View } from "react-native";

import NowHereError from "@/components/Nowhere-Error";
import NowHereMap from "@/components/NowHereMap";
import React from "react";

export const ErrorBoundary = NowHereError;

export default function Index() {
  return (
    <View className="flex-1 relative">
      <NowHereMap />
    </View>
  );
}
