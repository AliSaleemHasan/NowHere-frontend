import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import { displayTag, tagColor } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import Gallery from "react-native-awesome-gallery";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  images: string[];
  tag: string;
  width: number;
  height: number;
};

function triggerSelectionHaptic() {
  void Haptics.selectionAsync().catch(() => undefined);
}

export default function SnapPhotoHero({ images, tag, width, height }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const carouselRef = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const color = tagColor(tag);
  const hasImages = images.length > 0;
  const safeIndex = Math.min(activeIndex, Math.max(images.length - 1, 0));

  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
    triggerSelectionHaptic();
  }, []);

  const openGallery = useCallback(() => {
    if (!hasImages) return;
    triggerSelectionHaptic();
    setGalleryOpen(true);
  }, [hasImages]);

  const jumpTo = useCallback((index: number) => {
    carouselRef.current?.scrollTo({ index, animated: true });
    setActiveIndex(index);
    triggerSelectionHaptic();
  }, []);

  return (
    <View testID="snap-photo-hero">
      <View
        className="overflow-hidden bg-primary"
        style={{ width, height }}
      >
        {hasImages ? (
          <Carousel
            ref={carouselRef}
            width={width}
            height={height}
            autoPlay={false}
            data={images}
            loop={images.length > 1}
            scrollAnimationDuration={400}
            onSnapToItem={handleIndexChange}
            renderItem={({ item }) => (
              <Pressable
                onPress={openGallery}
                accessibilityRole="imagebutton"
                accessibilityLabel={t("snaps.hero.viewFullScreen")}
                className="h-full w-full"
              >
                <ImageWithSkeleton uri={item} className="h-full w-full" />
              </Pressable>
            )}
          />
        ) : (
          <View
            testID="snap-photo-placeholder"
            className="h-full w-full items-center justify-center"
          >
            <Ionicons name="image-outline" size={42} color="#ffffff" />
            <Text className="mt-3 text-sm font-medium text-white/80">
              {t("snaps.hero.noPhotos")}
            </Text>
          </View>
        )}

        <View
          pointerEvents="none"
          className="absolute inset-x-0 top-0 h-28"
          style={{ backgroundColor: "rgba(15,13,35,0.28)" }}
        />
        <View
          pointerEvents="none"
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ backgroundColor: "rgba(15,13,35,0.35)" }}
        />

        <View className="absolute left-4 top-4">
          <View
            testID="snap-tag"
            className="flex-row items-center rounded-full px-3 py-1.5"
            style={{ backgroundColor: color }}
          >
            <Text className="text-xs font-bold uppercase tracking-wide text-white">
              {displayTag(tag)}
            </Text>
          </View>
        </View>

        {hasImages ? (
          <View className="absolute right-4 top-4">
            <View
              testID="snap-photo-count"
              className="rounded-full bg-black/55 px-2.5 py-1.5"
            >
              <Text className="text-xs font-semibold text-white">
                {t("snaps.hero.photoCount", {
                  current: safeIndex + 1,
                  total: images.length,
                })}
              </Text>
            </View>
          </View>
        ) : null}

        {hasImages ? (
          <View className="absolute bottom-3 right-4 flex-row items-center rounded-full bg-black/45 px-2.5 py-1">
            <Ionicons name="expand-outline" size={12} color="#ffffff" />
            <Text className="ml-1 text-[11px] font-medium text-white">
              {t("snaps.hero.tapToExpand")}
            </Text>
          </View>
        ) : null}
      </View>

      {images.length > 1 ? (
        <View
          testID="snap-filmstrip"
          className="flex-row gap-2 bg-gray-50 px-5 pt-3"
        >
          {images.map((uri, index) => {
            const selected = index === safeIndex;
            return (
              <Pressable
                key={`${uri}-${index}`}
                onPress={() => jumpTo(index)}
                accessibilityLabel={t("snaps.hero.photoA11y", {
                  index: index + 1,
                })}
                className="overflow-hidden rounded-xl"
                style={{
                  borderWidth: 2,
                  borderColor: selected ? "#FFCC00" : "transparent",
                }}
              >
                <Image source={{ uri }} className="h-14 w-12" />
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <Modal
        visible={galleryOpen}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => setGalleryOpen(false)}
      >
        <View testID="snap-gallery" className="flex-1 bg-black">
          <View
            style={{ paddingTop: Math.max(insets.top, 16) }}
            className="z-10 flex-row items-center justify-between px-5 pb-2"
          >
            <Text className="text-sm font-semibold text-white">
              {t("snaps.hero.photoOf", {
                current: safeIndex + 1,
                total: images.length,
              })}
            </Text>
            <Pressable
              onPress={() => setGalleryOpen(false)}
              accessibilityLabel={t("snaps.hero.closeGallery")}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="close" size={22} color="#ffffff" />
            </Pressable>
          </View>
          <Gallery
            data={images}
            initialIndex={safeIndex}
            onIndexChange={(index) => {
              setActiveIndex(index);
              carouselRef.current?.scrollTo({ index, animated: false });
            }}
            loop={false}
            renderItem={({ item, index, setImageDimensions }) => (
              <Image
                source={{ uri: item }}
                accessibilityLabel={t("snaps.hero.photoA11y", {
                  index: index + 1,
                })}
                className="h-full w-full"
                resizeMode="contain"
                onLoad={(event) => {
                  const { width: imageWidth, height: imageHeight } =
                    event.nativeEvent.source;
                  if (imageWidth && imageHeight) {
                    setImageDimensions({
                      width: imageWidth,
                      height: imageHeight,
                    });
                  }
                }}
              />
            )}
            onSwipeToClose={() => setGalleryOpen(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
