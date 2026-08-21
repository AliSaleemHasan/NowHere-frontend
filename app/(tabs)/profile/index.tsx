import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import ProfileImage from "@/features/users/components/ProfileImage";
import { useUserStore } from "@/features/users/context/user-store";
import { apiAuthFetch } from "@/lib/fetch-api";
import { GetUserResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Text, View } from "react-native";

export const ErrorBoundary = NowHereError;

export default function Profile() {
  const storedUser = useUserStore((state) => state.user);
  const userId = storedUser?.id;

  const userInfo = useQuery({
    queryKey: ["profile", userId],
    throwOnError: false,
    queryFn: async () =>
      await apiAuthFetch<GetUserResponse>({
        api: "users",
        url: `users/id/${userId}`,
        options: { method: "GET" },
      }),
    enabled: !!userId,
    initialData: storedUser ? { success: true, data: storedUser } : undefined,
  });

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-sm text-gray-500">
          User session not found. Please log out and sign in again.
        </Text>
      </View>
    );
  }

  if (userInfo.isLoading) return <Loading />;

  if (userInfo.isError) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-sm text-error">
          {userInfo.error?.message || "Failed to load profile"}
        </Text>
      </View>
    );
  }

  const rawData = userInfo.data?.data as any;
  const user = rawData?.user || rawData;
  const profileImageUrl = user?.image || user?.userImage || rawData?.userImage;

  return (
    <View className="flex items-center justify-center h-full w-full  p-5 gap-5">
      <ProfileImage image={profileImageUrl} userId={userId}></ProfileImage>
      <View className="flex-1 gap-4">
        <Text className="font-thin text-sm">
          Welcome back to NowHere, your information is listed below:
        </Text>

        <View className="gap-2 w-full">
          <Text className="text-sm">email</Text>
          <Text className="text-sm font-thin">{user?.email}</Text>
        </View>

        <View className="gap-2 w-full">
          <Text className="text-sm">name</Text>
          <Text className="text-sm font-thin">
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
      </View>
    </View>
  );
}
