import React, { useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import TagsFilter from "@/features/map/components/TagsFilter";
import { UnifiedMap } from "@/features/map/components/UnifiedMap";
import MapMarker from "@/features/snaps/components/MapMarker";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import {
  getSnapId,
  isValidSnapLocation,
} from "@/features/snaps/types/snaps-api-type";
import { useAuth } from "@/features/auth/context/auth-store";
import { useRouter } from "expo-router";

const NowHereMap = () => {
  const query = useSnapSocket();
  const router = useRouter();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const location = useLocation((state) => state.location);
  const loading = useLocation((state) => state.loading);

  const hasValidLocation = isValidSnapLocation(location);
  const [lng, lat] = hasValidLocation ? location.coordinates : [0, 0];

  const snaps = (query.data?.success ? query.data.data : undefined) ?? [];

  const mapRegion = useMemo(
    () => ({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    }),
    [lat, lng],
  );

  if (!hasValidLocation || loading) {
    return (
      <View className="h-full w-full flex-1 items-center justify-center gap-3">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-gray-500">Locating...</Text>
      </View>
    );
  }

  return (
    <TagsFilter isLoggedIn={isLoggedIn}>
      <UnifiedMap region={mapRegion} showUserLocation>
        {snaps.map((snap) => {
          const snapId = getSnapId(snap);
          const coordinates = snap.location?.coordinates;
          if (!snapId || !coordinates || coordinates.length < 2) return null;
          return (
            <MapMarker
              id={snapId}
              lat={Number(coordinates[1])}
              lng={Number(coordinates[0])}
              tag={snap.tag}
              key={snapId}
            />
          );
        })}
      </UnifiedMap>
      {isLoggedIn && query.isError ? (
        <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-medium text-primary">
            Couldn’t load nearby snaps
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            Pull back to this tab or retry. Your snap is still saved if you already shared.
          </Text>
          <TouchableOpacity
            onPress={() => query.refetch()}
            className="mt-3 self-start rounded-full bg-primary px-4 py-2"
          >
            <Text className="text-xs font-semibold text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isLoggedIn && !query.isLoading && snaps.length === 0 ? (
        <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-medium text-primary">
            No unseen snaps nearby
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            New snaps you haven’t opened yet show up here. Switch to “Already opened” for snaps you’ve viewed.
          </Text>
        </View>
      ) : null}
      {!isLoggedIn ? (
        <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-medium text-primary">
            Sign in to see snaps nearby
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            Nearby and opened feeds are available after you log in.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-3 self-start rounded-full bg-primary px-4 py-2"
          >
            <Text className="text-xs font-semibold text-white">Sign in</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TagsFilter>
  );
};

export default NowHereMap;
