import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { snapQueryKeys } from "@/features/snaps/api/snap-query";
import SnapListRow from "@/features/snaps/components/SnapListRow";
import { loadSnapsByIds } from "@/features/snaps/lib/load-snaps-by-ids";
import { getSnapId } from "@/features/snaps/types/snaps-api-type";
import { useBookmarks } from "@/features/users/api/useBookmarks";
import { getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export const ErrorBoundary = NowHereError;

export default function SavedSnaps() {
  const { t } = useTranslation();
  const router = useRouter();
  const bookmarksQuery = useBookmarks();
  const ids = useMemo(
    () => (bookmarksQuery.data ?? []).map((item) => item.snapId),
    [bookmarksQuery.data],
  );
  const snapsQuery = useQuery({
    queryKey: [...snapQueryKeys.bookmarked, ids],
    throwOnError: false,
    enabled: bookmarksQuery.isSuccess,
    queryFn: () => loadSnapsByIds(ids),
  });
  const snaps = snapsQuery.data ?? [];
  const isLoading =
    (bookmarksQuery.isLoading && !bookmarksQuery.data) ||
    (bookmarksQuery.isSuccess && snapsQuery.isLoading && snaps.length === 0);
  const error = bookmarksQuery.error ?? snapsQuery.error;
  const isError =
    (bookmarksQuery.isError && !bookmarksQuery.data) ||
    (snapsQuery.isError && snaps.length === 0);

  if (isLoading) {
    return <Loading cause={t("snaps.saved.loading")} />;
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <Ionicons name="cloud-offline-outline" size={24} color="#ef4444" />
        </View>
        <Text className="mt-4 text-center text-base font-semibold text-primary">
          {t("snaps.saved.errorTitle")}
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
          {getErrorMessage(error, t("snaps.saved.errorBody"))}
        </Text>
        <TouchableOpacity
          onPress={() => {
            void bookmarksQuery.refetch();
            void snapsQuery.refetch();
          }}
          className="mt-6 rounded-full bg-primary px-5 py-3"
        >
          <Text className="font-semibold text-white">
            {t("snaps.saved.retry")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      testID="saved-snaps-list"
      className="flex-1 bg-gray-50"
      data={snaps}
      keyExtractor={(item) => getSnapId(item) ?? item.id}
      contentContainerClassName="p-4 pb-10"
      refreshing={bookmarksQuery.isRefetching || snapsQuery.isRefetching}
      onRefresh={() => {
        void bookmarksQuery.refetch();
        void snapsQuery.refetch();
      }}
      ListEmptyComponent={
        <View className="items-center px-6 pt-16">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <Ionicons name="bookmark-outline" size={24} color="#0f0d23" />
          </View>
          <Text className="mt-4 text-center text-base font-semibold text-primary">
            {t("snaps.saved.emptyTitle")}
          </Text>
          <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
            {t("snaps.saved.emptyBody")}
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
