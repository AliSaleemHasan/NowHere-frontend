import Loading from "@/components/Loading";
import { useAuth } from "@/features/auth/context/auth-store";
import ProfileImage from "@/features/users/components/ProfileImage";
import { apiAuthFetch } from "@/lib/fetch-api";
import { UserResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, View } from "react-native";

export default function Profile() {
  const userId = useAuth((state) => state.user);

  const userInfo = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () =>
      await apiAuthFetch<UserResponse>({
        url: `users/id/${userId}`,
        options: { method: "GET" },
      }),
  });

  if (userInfo.isLoading) return <Loading></Loading>;

  return (
    <View className="flex items-center justify-center h-full w-full  p-5 gap-5">
      <ProfileImage
        image={userInfo.data?.data?.image}
        userId={userId}
      ></ProfileImage>
      <View className="flex-1 gap-4">
        <Text className="font-thin text-sm">
          Welcome back to NowHere, your information is listed below:
        </Text>

        <View className="gap-2 w-full">
          <Text className="text-sm">email</Text>
          <Text className="text-sm font-thin">
            {userInfo.data?.data?.email}
          </Text>
        </View>

        <View className="gap-2 w-full">
          <Text className="text-sm">name</Text>
          <Text className="text-sm font-thin">
            {userInfo.data?.data?.first_name} {userInfo.data?.data?.last_name}
          </Text>
        </View>
      </View>
    </View>
  );
}
