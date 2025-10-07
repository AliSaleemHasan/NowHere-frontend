import Divider from "@/components/Divider";
import SocialNetworkButton from "@/components/SocialNetworkButton";
import React from "react";
import { Text, View } from "react-native";

export default function SocialNetworksAuth() {
  return (
    <View className="gap-3">
      <Divider>
        <Text>OR</Text>
      </Divider>
      <Text className="text-xs text-gray-500  text-center">
        Sign up with social networks - Not supported yet!
      </Text>

      <View className="flex-row items-center justify-center gap-4">
        <SocialNetworkButton
          icon="logo-facebook"
          bg="bg-blue-300"
        ></SocialNetworkButton>
        <SocialNetworkButton
          icon="logo-google"
          bg="bg-orange-300"
        ></SocialNetworkButton>
      </View>
    </View>
  );
}
