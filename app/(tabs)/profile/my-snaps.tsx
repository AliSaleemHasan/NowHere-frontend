import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { useMySnaps } from "@/features/snaps/api/useMySnaps";
import SnapListRow from "@/features/snaps/components/SnapListRow";
import { getSnapId } from "@/features/snaps/types/snaps-api-type";
import { getErrorMessage } from "@/utils";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

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
        <EmptyState
          tone="danger"
          icon="cloud-offline-outline"
          title={t("snaps.mySnaps.errorTitle")}
          body={getErrorMessage(query.error, t("snaps.mySnaps.errorBody"))}
          actionLabel={t("snaps.mySnaps.retry")}
          onAction={() => {
            void query.refetch();
          }}
        />
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
        <EmptyState
          icon="images-outline"
          title={t("snaps.mySnaps.emptyTitle")}
          body={t("snaps.mySnaps.emptyBody")}
        />
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
