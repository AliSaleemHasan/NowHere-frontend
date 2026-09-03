import { askLocationPermission } from "@/lib/location";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  withErrorImage?: boolean;
  onGranted: () => void | Promise<void>;
}

const LocationRequired = (props: Props) => {
  const handleLocationPermission = async () => {
    const granted = await askLocationPermission();
    if (!granted) return;
    await props.onGranted();
  };

  return (
    <View className="flex flex-1 items-center justify-center">
      {props.withErrorImage && (
        <View className="relative h-44 w-44">
          <Image
            className="h-full w-full rounded-full"
            source={require("@/assets/images/location-required.png")}
            resizeMode="contain"
          />
        </View>
      )}
      <View className="items-center gap-5 p-4">
        <Text className="text-center text-sm">
          To continue, please allow location access by tapping the button below.
        </Text>
        <TouchableOpacity
          onPress={handleLocationPermission}
          className="rounded-md bg-alert p-4"
        >
          <Text className="text-sm text-white">Grant Location Access</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRequired;
