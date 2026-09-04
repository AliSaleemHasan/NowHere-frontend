import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { useMySnaps } from "@/features/snaps/api/useMySnaps";
import SnapListRow from "@/features/snaps/components/SnapListRow";
import { getSnapId } from "@/features/snaps/types/snaps-api-type";
import { getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export const ErrorBoundary = NowHereError;

export default function MySnaps() {
  const { t } = useTranslation();
  const router = useRouter();
  const query = useMySnaps();
  const snaps = query.data ?? [];

  if (query.isLoading && snaps.length === 0) {
    return <Loading cause={t("snaps.mySnaps.loading")} />;
  }

  if (query.isError && snaps.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Ionicons name="cloud-offline-outline" size={24} color="#ef4444" />
        </View>
        <Text className="mt-4 text-center text-base font-semibold text-primary">
          {t("snaps.mySnaps.errorTitle")}
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
          {getErrorMessage(query.error, t("snaps.mySnaps.errorBody"))}
        </Text>
        <TouchableOpacity
          onPress={() => query.refetch()}
          className="mt-6 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">
            {t("snaps.mySnaps.retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      testID="my-snaps-list"
      className="flex-1 bg-gray-50"
      data={snaps}
      keyExtractor={(item) => getSnapId(item) ?? item.id}
      contentContainerClassName="p-4 pb-10"
      refreshing={query.isRefetching}
      onRefresh={() => {
        void query.refetch();
      }}
      ListEmptyComponent={
        <View className="items-center px-6 pt-16">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Ionicons name="images-outline" size={24} color="#0f0d23" />
          </View>
          <Text className="mt-4 text-center text-base font-semibold text-primary">
            {t("snaps.mySnaps.emptyTitle")}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
            {t("snaps.mySnaps.emptyBody")}
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const id = getSnapId(item);
        if (!id) return null;
        return (
          <SnapListRow
            snap={item}
            onPress={() => router.push(`/(snaps)/${id}`)}
          />
        );
      }}
    />
  );
}
