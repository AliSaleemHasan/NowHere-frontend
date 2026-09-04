import { haversineDistanceMeters } from "@/lib/geo";
import { useRouter } from "expo-router";
import React, { type ReactNode } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import {
  getSnapId,
  isValidSnapLocation,
  type Snap,
  type SnapLocation,
} from "../types/snaps-api-type";
import SnapListRow from "./SnapListRow";

type Props = {
  snaps: Snap[];
  viewerLocation?: SnapLocation | null;
  isLoading?: boolean;
  empty?: ReactNode;
};

export default function NearbySnapList({
  snaps,
  viewerLocation,
  isLoading = false,
  empty,
}: Props) {
  const router = useRouter();

  if (isLoading && snaps.length === 0) {
    return (
      <View
        testID="nearby-snap-list-loading"
        className="flex-1 items-center justify-center bg-gray-50"
      >
        <ActivityIndicator size="large" color="#0f0d23" />
      </View>
    );
  }

  return (
    <FlatList
      testID="nearby-snap-list"
      className="flex-1 bg-gray-50"
      data={snaps}
      keyExtractor={(item) => getSnapId(item) ?? item.id}
      contentContainerClassName={
        snaps.length === 0 ? "flex-grow justify-center px-5 pb-8" : "p-4 pb-8"
      }
      ListEmptyComponent={empty ? <View>{empty}</View> : null}
      renderItem={({ item }) => {
        const id = getSnapId(item);
        if (!id) return null;
        const distanceMeters = isValidSnapLocation(viewerLocation)
          ? haversineDistanceMeters(
              viewerLocation.coordinates,
              item.location.coordinates,
            )
          : null;
        return (
          <SnapListRow
            snap={item}
            distanceMeters={distanceMeters}
            onPress={() => router.push(`/(snaps)/${id}`)}
          />
        );
      }}
    />
  );
}
