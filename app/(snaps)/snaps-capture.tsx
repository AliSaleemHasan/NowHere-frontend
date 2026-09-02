import AppCamera from "@/components/camera/AppCamera";
import { useSnap } from "@/features/snaps/context/snap-store";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Gallery from "react-native-awesome-gallery";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SnapsCapture() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"camera" | "review">("camera");
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  const snaps = useSnap((state) => state.snaps);
  const addSnap = useSnap((state) => state.addSnap);
  const deleteSnap = useSnap((state) => state.removeSnap);

  const handleDeleteCurrentSnap = () => {
    const currentSnap = snaps[galleryIndex];
    if (snaps.length <= 1) {
      deleteSnap(currentSnap);
      setMode("camera");
      return;
    }

    deleteSnap(currentSnap);
    if (galleryIndex >= snaps.length - 1) {
      setGalleryIndex(Math.max(0, snaps.length - 2));
    }
  };

  const handleProceedToInputs = () => {
    router.replace("/(snaps)/snap-inputs");
  };

  // REVIEW MODE
  if (mode === "review" && snaps.length > 0) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1 justify-between">
          {/* Top Review Header */}
          <View
            style={{ paddingTop: Math.max(insets.top, 16) }}
            className="flex-row items-center justify-between px-5 pb-2 z-10"
          >
            <TouchableOpacity
              onPress={() => setMode("camera")}
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
            >
              <Ionicons name="camera" size={22} color="#ffffff" />
            </TouchableOpacity>

            <Text className="text-white text-sm font-semibold">
              {galleryIndex + 1} of {snaps.length}
            </Text>

            <TouchableOpacity
              onPress={handleProceedToInputs}
              className="bg-blue-600 px-4 py-2 rounded-full"
            >
              <Text className="text-white font-semibold text-sm">Next</Text>
            </TouchableOpacity>
          </View>

          {/* Gallery View */}
          <View className="flex-1">
            <Gallery
              onIndexChange={(newIndex) => setGalleryIndex(newIndex)}
              loop={false}
              data={snaps}
              disableVerticalSwipe
              renderItem={({ item }) => (
                <ImageBackground
                  source={{ uri: item }}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              )}
            />
          </View>

          {/* Bottom Controls */}
          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="flex-row items-center justify-between px-8 pt-4"
          >
            <TouchableOpacity
              onPress={handleDeleteCurrentSnap}
              className="w-12 h-12 rounded-full bg-red-600/30 items-center justify-center"
            >
              <FontAwesome name="trash" size={22} color="#ff4444" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode("camera")}
              className="flex-row items-center bg-white/20 px-5 py-3 rounded-full gap-2"
            >
              <FontAwesome name="plus" size={16} color="#ffffff" />
              <Text className="text-white text-sm font-medium">Add More</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // LIVE IN-APP CAMERA MODE
  return (
    <AppCamera
      onCapture={(uri) => addSnap(uri)}
      onClose={() => router.replace("/")}
      leftBottomControl={
        snaps.length > 0 ? (
          <TouchableOpacity
            onPress={() => setMode("review")}
            className="relative w-14 h-14 rounded-xl border-2 border-white overflow-hidden"
          >
            <Image
              source={{ uri: snaps[snaps.length - 1] }}
              className="w-full h-full"
            />
            <View className="absolute top-0 right-0 bg-blue-600 px-1.5 py-0.5 rounded-bl-lg">
              <Text className="text-white text-xs font-bold">
                {snaps.length}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null
      }
      rightBottomControl={
        snaps.length > 0 ? (
          <TouchableOpacity
            onPress={handleProceedToInputs}
            className="w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg"
          >
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : null
      }
    />
  );
}



