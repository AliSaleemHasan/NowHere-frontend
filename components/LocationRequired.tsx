import { useLocation } from "@/features/snaps/context/location-store";
import { askLocationPermission } from "@/lib/location";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const LocationRequired = () => {
  const fetchLocation = useLocation((state) => state.featchLocation);

  const handleLocationPermission = async () => {
    const granted = await askLocationPermission();
    if (granted) {
      fetchLocation();
    }
  };
  return (
    <View className="flex items-center flex-1">
      <View className=" flex items-center p-4 gap-5">
        <Text className="font-bold text-Primary">Location Access Needed</Text>
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
