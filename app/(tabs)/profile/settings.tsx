import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Loading from "@/components/Loading";
import { UserSetting } from "@/features/users/types/users-api-type";
import { apiAuthFetch } from "@/lib/fetch-api";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";

let userUISettings: {
  [k in keyof UserSetting]: {
    title: string;
    description: string;
    in: string;
  };
} = {
  max_distance: {
    title: "User Max Visibility Distance ",
    description:
      "The distance were that user cannot say snaps after depending on location",
    in: "Meters",
  },
  new_snap_distance: {
    title: "Allowed range to post new snap ",
    description: "The minimmum distance for the previous post of the user",
    in: "Meters",
  },
  snapDisappearTime: {
    title: "Visibility expiration time (Days)",
    description: "Number of days the snaps will be visible in users locaiton",
    in: "Days",
  },
};
export default function Settings() {
  const userSettingsQuery = useQuery({
    queryKey: ["users/settings"],
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

  if (userSettingsQuery.error) return <Redirect href={".."}></Redirect>;

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
