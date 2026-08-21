import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { useSnap } from "@/features/snaps/api/useSnap";
import { useUser } from "@/features/users/api/useUser";
import { TagsColors } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

export const ErrorBoundary = NowHereError;

const SnapDetails = () => {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const CARD_WIDTH = Math.min(width * 0.9, 400);
  const IMAGE_HEIGHT = CARD_WIDTH * (16 / 10);

  const [activeIndex, setActiveIndex] = useState(0);

  const { data: snapData, isLoading: isSnapLoading } = useSnap(
    params.id as string
  );

  const snapPayload = snapData?.data;
  const snap = snapPayload?.snap || (snapPayload as any);
  const snapCreatorId = snap?._userId || snap?.userId;

  const { data: userData, isLoading: isUserLoading } = useUser(snapCreatorId);

  if (isSnapLoading || isUserLoading) return <Loading />;

  const user = userData?.data ? ((userData.data as any).user || userData.data) : undefined;
  const images = snapPayload?.imageKeys || snap?.snaps || [];

  const snapTag = (snap?.tag || snap?.snap?.tag || "SOCIAL") as keyof typeof TagsColors;
  const snapDescription = snap?.description || snap?.snap?.description || "";

  return (
    // The main container to center everything
    <View className="flex-1 items-center bg-white p-4">
      {/* This is the white card container that holds both the image and the text */}
      <View
        style={{ width: CARD_WIDTH }}
        className="bg-white rounded-lg overflow-hidden"
      >
        {/* Image/Carousel container */}
        <View style={{ height: IMAGE_HEIGHT, width: "100%" }}>
          <Carousel
            // The width of the carousel items is the CARD_WIDTH
            width={CARD_WIDTH}
            height={IMAGE_HEIGHT} // Carousel height matches image height
            autoPlay={false}
            data={images}
            loop={images.length > 1}
            scrollAnimationDuration={500}
            onSnapToItem={(index) => setActiveIndex(index)}
            renderItem={({ item }: { item: string }) => (
              <ImageWithSkeleton uri={item} className={"w-full flex-1"} />
            )}
          />
        </View>

        {/* Text/Details section below the image */}
        <View className="p-4">
          <View className="flex items-center justify-between flex-row">
            <Text className="font-bold text-lg mb-1">
              {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Anonymous"}
            </Text>

            <Text
              className="font-bold text-sm mb-1 px-2 rounded-full text-white "
              style={{
                backgroundColor: TagsColors[snapTag] || "black",
              }}
            >
              {snapTag}
            </Text>
          </View>
          <ScrollView style={{ maxHeight: 50 }}>
            <Text className="text-base text-gray-700">
              {snapDescription}
            </Text>
          </ScrollView>

          {/* Pagination Dots - only show if there are multiple images */}
          {images.length > 1 && (
            <View className="flex-row justify-center items-center mt-3">
              {images.map((_: string, index: number) => (
                <View
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    activeIndex === index ? "bg-black" : "bg-gray-300"
                  }`}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SnapDetails;

