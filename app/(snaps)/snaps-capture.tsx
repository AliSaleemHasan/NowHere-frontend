import { useSnap } from "@/features/snaps/context/snap-store";
import { handleCameraCapture } from "@/lib/image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import Gallery from "react-native-awesome-gallery";

export default function SnapsCapture() {
  const router = useRouter();
  const snaps = useSnap((state) => state.snaps);
  const addSnap = useSnap((state) => state.addSnap);
  const deleteSnap = useSnap((state) => state.removeSnap);

  const [index, setIndex] = useState<number>(0);

  const handleCaptureImage = async (): Promise<void> => {
    const capture = await handleCameraCapture();
    if (!capture.canceled && capture?.assets?.[0]?.uri) {
      addSnap(capture.assets[0].uri);
    }
  };

  const handleDeleteSnap = () => {
    const currentSnap = snaps[index];
    if (snaps.length <= 1) {
      deleteSnap(currentSnap);
      router.replace("/");
      return;
    }

    deleteSnap(currentSnap);
    if (index >= snaps.length - 1) {
      setIndex(Math.max(0, snaps.length - 2));
    }
  };

  if (snaps.length === 0) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1">
      <Gallery
        onIndexChange={(newIndex) => setIndex(newIndex)}
        loop
        data={snaps}
        disableVerticalSwipe
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item }}
            className="w-full h-[90%]"
            resizeMode="cover"
          />
        )}
      />
      <View
        className="flex-row bg-background backdrop-blur-lg w-full h-[13%] items-center rounded-lg justify-between gap-10"
      >
        <TouchableOpacity
          onPress={handleDeleteSnap}
          className="flex-1 h-full items-center justify-center"
        >
          <FontAwesome name="trash" size={25} color="red" />
        </TouchableOpacity>
        <Text className="text-sm">
          {index + 1} of {snaps.length}
        </Text>

        <TouchableOpacity
          onPress={handleCaptureImage}
          className="flex-1 items-center justify-center h-full"
        >
          <FontAwesome name="plus-circle" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

