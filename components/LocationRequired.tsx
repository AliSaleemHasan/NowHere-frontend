import { useLocation } from "@/features/snaps/context/location-store";
import { askLocationPermission } from "@/lib/location";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  withErrorImage?: boolean;
}
const LocationRequired = (props: Props) => {
  const fetchLocation = useLocation((state) => state.featchLocation);

  const locationError = useLocation((state) => state.error);

  const handleLocationPermission = async () => {
    const granted = await askLocationPermission();

    if (!granted) return;
    await fetchLocation();
  };

  if (locationError) {
    return (
      <View className=" flex-1 items-center justify-center">
        <Text className="text-red-200">{locationError}</Text>
      </View>
    );
  }
  return (
    <View className="flex items-center justify-center flex-1 ">
      {props.withErrorImage && (
        <View className="w-44 h-44  relative">
          <Image
            className="w-full h-full rounded-full"
            source={require("@/assets/images/location-required.png")}
            resizeMode="contain"
          />
        </View>
      )}
      <View className=" flex items-center p-4 gap-5">
        <Text className="text-sm text-center">
          To continue, please allow location access by tapping the button below.
        </Text>
        <TouchableOpacity
          onPress={handleLocationPermission}
          className=" p-4  bg-alert rounderd-full  rounded-md "
        >
          <Text className="text-white text-sm ">Grant Location Access</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRequired;
