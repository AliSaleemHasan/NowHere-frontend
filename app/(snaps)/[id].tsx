import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import Loading from "@/components/Loading";
import { useSnap } from "@/features/snaps/api/useSnap";
import { useUser } from "@/features/users/api/useUser";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const SnapDetails = () => {
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const CARD_WIDTH = Math.min(width * 0.9, 400);
  const IMAGE_HEIGHT = CARD_WIDTH * (16 / 10);

  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: snapData,
    isLoading: isSnapLoading,
    isError: isSnapError,
    error: snapError,
  } = useSnap(params.id as string);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useUser(snapData?.data?.snap._userId);

  if (isSnapLoading || isUserLoading) return <Loading />;

  if (isSnapError || isUserError) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-3xl font-bold text-error text-center">
          {snapError?.message || userError?.message}
        </Text>
      </View>
    );
  }

  const snap = snapData?.data;
  const user = userData?.data?.user;
  const images = snap?.imageKeys || [];

  return (
    // The main container to center everything
    <View className="flex-1 items-center bg-white p-4">
      {/* This is the white card container that holds both the image and the text */}
      <View
        style={{ width: CARD_WIDTH }}
        className="bg-white rounded-lg  overflow-hidden"
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
          <Text className="font-bold text-lg mb-1">
            {`${user?.firstName} ${user?.lastName}`}
          </Text>
          <ScrollView style={{ maxHeight: 50 }}>
            <Text className="text-base text-gray-700">
              {snap?.snap.description}
            </Text>
          </ScrollView>

          {/* Pagination Dots - only show if there are multiple images */}
          {images.length > 1 && (
            <View className="flex-row justify-center items-center mt-3">
              {images.map((_, index) => (
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
