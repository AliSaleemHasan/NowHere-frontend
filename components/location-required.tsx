import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

const LocationRequired = () => {
  return (
    <View className="flex items-center  w-full h-full">
      <View className="flex-[.6]  w-full   ">
        <ImageBackground
          source={require("@/assets/images/location-required.png")}
          alt="required image"
          resizeMode="cover"
          className=" flex-1  w-full h-full overflow-hidden"
        />
      </View>
      <View className="flex-[0.4] flex items-center p-4 gap-5">
        <Text className="font-bold text-red-500">Location Access Needed</Text>
        <Text className="text-sm text-center">
          To continue, please allow location access by tapping the button below.
        </Text>
        <TouchableOpacity className="bg-gray-900 p-4  rounderd-full  rounded-md ">
          <Text className="text-white text-sm">Grant Location Access</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRequired;
