import { AppCamera } from "@/components/camera";
import { useSnapDraft } from "@/features/snaps/context/snap-store";
import { MAX_SNAP_IMAGES } from "@/lib/image-upload";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import Toast from "react-native-toast-message";

export default function SnapsCapture() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"camera" | "review">("camera");
  const [galleryIndex, setGalleryIndex] = useState<number>(0);

  const snaps = useSnapDraft((state) => state.snaps);
  const addSnap = useSnapDraft((state) => state.addSnap);
  const deleteSnap = useSnapDraft((state) => state.removeSnap);

  const handleCapture = (uri: string) => {
    if (snaps.length >= MAX_SNAP_IMAGES) {
      Toast.show({
        type: "info",
        text1: t("snaps.capture.limitToast", { count: MAX_SNAP_IMAGES }),
      });
      setMode("review");
      return;
    }
    addSnap(uri);
  };

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

  if (mode === "review" && snaps.length > 0) {
    return (
      <View className="flex-1 bg-black">
        <SafeAreaView className="flex-1 justify-between">
          <View
            style={{ paddingTop: Math.max(insets.top, 16) }}
            className="z-10 flex-row items-center justify-between px-5 pb-2"
          >
            <TouchableOpacity
              onPress={() => setMode("camera")}
              className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
            >
              <Ionicons name="camera" size={22} color="#ffffff" />
            </TouchableOpacity>

            <Text className="text-sm font-semibold text-white">
              {t("snaps.hero.photoOf", {
                current: galleryIndex + 1,
                total: snaps.length,
              })}
            </Text>

            <TouchableOpacity
              onPress={handleProceedToInputs}
              className="rounded-full bg-blue-600 px-4 py-2"
            >
              <Text className="text-sm font-semibold text-white">
                {t("snaps.capture.next")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1">
            <Gallery
              onIndexChange={(newIndex) => setGalleryIndex(newIndex)}
              loop={false}
              data={snaps}
              disableVerticalSwipe
              renderItem={({ item }) => (
                <ImageBackground
                  source={{ uri: item }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              )}
            />
          </View>

          <View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="flex-row items-center justify-between px-8 pt-4"
          >
            <TouchableOpacity
              onPress={handleDeleteCurrentSnap}
              className="h-12 w-12 items-center justify-center rounded-full bg-red-600/30"
            >
              <FontAwesome name="trash" size={22} color="#ff4444" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode("camera")}
              disabled={snaps.length >= MAX_SNAP_IMAGES}
              className="flex-row items-center gap-2 rounded-full bg-white/20 px-5 py-3"
            >
              <FontAwesome name="plus" size={16} color="#ffffff" />
              <Text className="text-sm font-medium text-white">
                {snaps.length >= MAX_SNAP_IMAGES
                  ? t("snaps.capture.limitReached")
                  : t("snaps.capture.addMore")}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <AppCamera
      onCapture={handleCapture}
      onClose={() => router.replace("/")}
      shutterDisabled={snaps.length >= MAX_SNAP_IMAGES}
      leftBottomControl={
        snaps.length > 0 ? (
          <TouchableOpacity
            onPress={() => setMode("review")}
            className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white"
          >
            <Image
              source={{ uri: snaps[snaps.length - 1] }}
              className="h-full w-full"
            />
            <View className="absolute right-0 top-0 rounded-bl-lg bg-blue-600 px-1.5 py-0.5">
              <Text className="text-xs font-bold text-white">
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
            className="h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg"
          >
            <Ionicons name="arrow-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : null
      }
    />
  );
}
