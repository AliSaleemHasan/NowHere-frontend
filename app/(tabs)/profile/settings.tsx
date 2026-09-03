import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { useUserSettings } from "@/features/users/api/useUserSettings";
import {
  formatDays,
  formatMeters,
  userSettingsCopy,
  UserSetting,
} from "@/features/users/types/users-api-type";
import { getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export const ErrorBoundary = NowHereError;

const ICONS: Record<
  (typeof userSettingsCopy)[keyof typeof userSettingsCopy]["icon"],
  keyof typeof Ionicons.glyphMap
> = {
  eye: "eye-outline",
  navigate: "navigate-outline",
  time: "time-outline",
};

function formatSettingValue(
  key: keyof typeof userSettingsCopy,
  value: number | undefined,
) {
  if (value == null) return "—";
  return userSettingsCopy[key].format === "days"
    ? formatDays(value)
    : formatMeters(value);
}

export default function Settings() {
  const query = useUserSettings();

  if (query.isLoading) {
    return <Loading cause="Loading your visibility settings…" />;
  }

  if (query.isError || !query.data) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Ionicons name="cloud-offline-outline" size={24} color="#ef4444" />
        </View>
        <Text className="mt-4 text-center text-base font-semibold text-primary">
          Settings aren’t ready yet
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
          {getErrorMessage(
            query.error,
            "Your profile is still being created. Try again in a moment.",
          )}
        </Text>
        <TouchableOpacity
          onPress={() => query.refetch()}
          className="mt-6 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const settings = query.data;

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="p-5 pb-10">
      <Text className="text-2xl font-semibold text-primary">Settings</Text>
      <Text className="mt-2 text-sm leading-5 text-gray-500">
        These values control how far you can see snaps, how far you must move
        before posting again, and how long snaps stay nearby.
      </Text>

      <View className="mt-5 gap-3">
        {(Object.keys(userSettingsCopy) as (keyof typeof userSettingsCopy)[]).map(
          (key) => {
            const copy = userSettingsCopy[key];
            return (
              <View
                key={key}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >
                <View className="flex-row items-start gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-2xl bg-gray-100">
                    <Ionicons name={ICONS[copy.icon]} size={20} color="#0f0d23" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-primary">
                      {copy.title}
                    </Text>
                    <Text className="mt-1 text-sm leading-5 text-gray-500">
                      {copy.description}
                    </Text>
                  </View>
                </View>
                <View className="mt-4 rounded-2xl bg-gray-50 px-4 py-3">
                  <Text className="text-xs uppercase tracking-wide text-gray-400">
                    Current value
                  </Text>
                  <Text className="mt-1 text-2xl font-semibold text-primary">
                    {formatSettingValue(key, settings[key as keyof UserSetting] as number)}
                  </Text>
                </View>
              </View>
            );
          },
        )}
      </View>

      <Text className="mt-6 text-center text-xs text-gray-400">
        Settings are assigned with your account and can’t be edited in this
        version.
      </Text>
    </ScrollView>
  );
}
