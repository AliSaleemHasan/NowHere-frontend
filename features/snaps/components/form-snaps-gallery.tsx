import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useSnap } from "../context/snap-store";

const FormSnapsGallery = () => {
  const snaps = useSnap((state) => state.snaps);
  const removeSnap = useSnap((state) => state.removeSnap);
  return (
    <View className=" h-[42%] bg-primary relative top-0 ">
      <View className="flex-row  h-full  flex-wrap gap-1 items-stretch  ">
        {snaps.length !== 0 ? (
          snaps?.map((image, ind) => (
            <View
              className={`relative flex-1 border border-secondary min-w-24 rounded-md`}
              key={ind}
            >
              <ImageBackground
                className="w-full h-full absolute"
                resizeMode="cover"
                source={{ uri: image }}
                key={image}
              ></ImageBackground>
              <TouchableOpacity
                onPress={() => {
                  removeSnap(image);
                }}
              >
                <FontAwesome
                  name="close"
                  size={20}
                  className="absolute top-2 right-2 bg-red  text-white"
                ></FontAwesome>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View className="h-full flex-1 items-center justify-center">
            <Text className=" m-au text-center text-white text-sm">
              Please Add one or two images to continue
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FormSnapsGallery;
