import Divider from "@/components/divider";
import SocialNetworkButton from "@/components/social-network-button";
import React from "react";
import { Text, View } from "react-native";

export default function SocialNetworksAuth() {
  return (
    <View className="gap-3">
      <Divider>
        <Text>OR</Text>
      </Divider>
      <Text className="text-xs text-gray-500  text-center">
        Sign up with social networks
      </Text>

      <View className="flex-row items-center justify-center gap-4">
        <SocialNetworkButton
          icon="logo-facebook"
          bg="bg-blue-600"
        ></SocialNetworkButton>
        <SocialNetworkButton
          icon="logo-google"
          bg="bg-orange-800"
        ></SocialNetworkButton>
      </View>
    </View>
  );
}
