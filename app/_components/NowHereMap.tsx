import MapListToggle, {
  type MapViewMode,
} from "./MapListToggle";
import { useAuth } from "@/features/auth/context/auth-store";
import TagsFilter from "@/features/map/components/TagsFilter";
import { UnifiedMap } from "@/features/map/components/UnifiedMap";
import MapMarker from "@/features/snaps/components/MapMarker";
import NearbySnapList from "@/features/snaps/components/NearbySnapList";
import { useHiddenSnaps } from "@/features/snaps/context/hidden-snaps-store";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import { filterHiddenSnaps } from "@/features/snaps/lib/filter-hidden-snaps";
import {
  getSnapId,
  isValidSnapLocation,
} from "@/features/snaps/types/snaps-api-type";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const NowHereMap = () => {
  const { t } = useTranslation();
  const query = useSnapSocket();
  const router = useRouter();
  const params = useLocalSearchParams<{ seen?: string }>();
  const isLoggedIn = useAuth((state) => state.isLoggedIn);
  const location = useLocation((state) => state.location);
  const loading = useLocation((state) => state.loading);
  const hiddenSnapIds = useHiddenSnaps((state) => state.hiddenSnapIds);
  const [viewMode, setViewMode] = useState<MapViewMode>("map");

  const hasValidLocation = isValidSnapLocation(location);
  const [lng, lat] = hasValidLocation ? location.coordinates : [0, 0];
  const showSeen = params.seen === "1";

  const snaps = (query.data?.success ? query.data.data : undefined) ?? [];
  const visibleSnaps = useMemo(
    () => filterHiddenSnaps(snaps, hiddenSnapIds),
    [snaps, hiddenSnapIds],
  );

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
        <Text className="text-sm text-gray-500">{t("map.locating")}</Text>
      </View>
    );
  }

  const emptyTitle = showSeen
    ? t("map.emptySeenTitle")
    : t("map.emptyUnseenTitle");
  const emptyBody = showSeen
    ? t("map.emptySeenBody")
    : t("map.emptyUnseenBody");

  return (
    <TagsFilter isLoggedIn={isLoggedIn}>
      {viewMode === "list" ? (
        <NearbySnapList
          snaps={visibleSnaps}
          viewerLocation={location}
          isLoading={isLoggedIn && query.isLoading}
        />
      ) : (
        <UnifiedMap region={mapRegion} showUserLocation>
          {visibleSnaps.map((snap) => {
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
      )}
      <MapListToggle mode={viewMode} onChange={setViewMode} />
      {isLoggedIn && query.isError ? (
        <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-medium text-primary">
            {t("map.loadErrorTitle")}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            {t("map.loadErrorBody")}
          </Text>
          <TouchableOpacity
            onPress={() => query.refetch()}
            className="mt-3 self-start rounded-full bg-primary px-4 py-2"
          >
            <Text className="text-xs font-semibold text-white">
              {t("map.retry")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : isLoggedIn && !query.isLoading && visibleSnaps.length === 0 ? (
        <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-medium text-primary">{emptyTitle}</Text>
          <Text className="mt-1 text-xs text-gray-500">{emptyBody}</Text>
        </View>
      ) : null}
      {!isLoggedIn ? (
        <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
          <Text className="text-sm font-medium text-primary">
            {t("map.signInTitle")}
          </Text>
          <Text className="mt-1 text-xs text-gray-500">
            {t("map.signInBody")}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="mt-3 self-start rounded-full bg-primary px-4 py-2"
          >
            <Text className="text-xs font-semibold text-white">
              {t("map.signIn")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TagsFilter>
  );
};

export default NowHereMap;
