import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { UserSetting } from "@/features/users/types/users-api-type";
import { apiAuthFetch } from "@/lib/fetch-api";
import { userUISettings } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export const ErrorBoundary = NowHereError;

export default function Settings() {
  const userSettingsQuery = useQuery({
    queryKey: ["users/settings"],
    throwOnError: true,
    queryFn: () =>
      apiAuthFetch<UserSetting>({
        api: "users",
        url: "users/settings",
        options: {
          method: "GET",
        },
      }),
  });

  if (userSettingsQuery.isLoading) return <Loading></Loading>;

  return (
    <View className="p-3 gap-2 flex-1 divide-y-2">
      {Object.keys(userUISettings).map((key) => (
        <TouchableOpacity key={key} className=" gap-1  p-2 border-b  ">
          <Text className="text-sm ">
            {userUISettings[key as keyof UserSetting].title}
          </Text>
          <Text className="text-justify text-xs text-gray-700 font-thin">
            {userUISettings[key as keyof UserSetting].description}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs ">
              Value in {userUISettings[key as keyof UserSetting].in}
            </Text>
            <Text className="text-xs  text-alert">
              {userSettingsQuery.data?.data?.[key as keyof UserSetting]}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({});
