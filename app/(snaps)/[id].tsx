import Loading from "@/components/Loading";
import { useSnap } from "@/features/snaps/api/useSnap";
import { useUser } from "@/features/users/api/useUser";
import { API_URL } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import Gallery from "react-native-awesome-gallery";

const SnapDetails = () => {
  const params = useLocalSearchParams();

  const [index, setIndex] = useState<number>(0);
  const snap = useSnap(params.id as string);
  const user = useUser(snap?.data?.data?._userId);

  if (snap.isLoading || user.isLoading) return <Loading />;
  if (snap.isError || user.isError)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-red-500">
          {snap.error?.message || user.error?.message}
        </Text>
      </View>
    );

  // get the user data

  return (
    <View className="relative h-full">
      <Gallery
        loop
        data={snap.data?.data?.snaps.map((snap) => `${API_URL}/${snap}`) || []}
        disableVerticalSwipe
        onIndexChange={(index) => {
          setIndex(index);
        }}
        renderItem={({ item }) => (
          <ImageBackground
            source={{ uri: item }}
            className="w-full flex-1"
          ></ImageBackground>
        )}
      ></Gallery>

      <View className="gap-3 w-full bg-white/20 backdrop-blur-3xl pb-10 pt-5 px-5">
        <View className="flex-row gap-2 flex-wrap">
          <Text className="text-wrap text-xs italic">
            {user.data?.data?.first_name} {user.data?.data?.last_name} {" : "}
            {snap.data?.data?.description}
          </Text>
          <Text className=" text-wrap text-xs text-center"></Text>
        </View>
        <Text className=" font-thin text-sm text-center">
          Showing {index + 1} of {snap.data?.data?.snaps.length}{" "}
        </Text>
      </View>
    </View>
  );
};

export default SnapDetails;
