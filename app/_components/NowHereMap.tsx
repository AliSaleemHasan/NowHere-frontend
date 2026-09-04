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

type FeedStatus = {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

function NearbyFeedStatus({
  title,
  body,
  actionLabel,
  onAction,
  overlay = false,
}: FeedStatus & { overlay?: boolean }) {
  const action = actionLabel && onAction ? (
    <TouchableOpacity
      onPress={onAction}
      className={`mt-3 rounded-full bg-primary ${overlay ? "self-start px-4 py-2" : "self-center px-5 py-3"}`}
    >
      <Text
        className={`font-semibold text-white ${overlay ? "text-xs" : ""}`}
      >
        {actionLabel}
      </Text>
    </TouchableOpacity>
  ) : null;

  if (overlay) {
    return (
      <View className="absolute bottom-6 left-5 right-5 rounded-2xl bg-white px-4 py-3 shadow-sm">
        <Text className="text-sm font-medium text-primary">{title}</Text>
        <Text className="mt-1 text-xs text-gray-500">{body}</Text>
        {action}
      </View>
    );
  }

  return (
    <View className="items-center px-2 py-6">
      <Text className="text-center text-base font-semibold text-primary">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
        {body}
      </Text>
      {action}
    </View>
  );
}

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

  let feedStatus: FeedStatus | null = null;
  if (isLoggedIn && query.isError) {
    feedStatus = {
      title: t("map.loadErrorTitle"),
      body: t("map.loadErrorBody"),
      actionLabel: t("map.retry"),
      onAction: () => {
        void query.refetch();
      },
    };
  } else if (isLoggedIn && !query.isLoading && visibleSnaps.length === 0) {
    feedStatus = { title: emptyTitle, body: emptyBody };
  } else if (!isLoggedIn) {
    feedStatus = {
      title: t("map.signInTitle"),
      body: t("map.signInBody"),
      actionLabel: t("map.signIn"),
      onAction: () => router.push("/(auth)/login"),
    };
  }

  const statusNode = feedStatus ? (
    <NearbyFeedStatus {...feedStatus} overlay={viewMode === "map"} />
  ) : null;

  return (
    <TagsFilter isLoggedIn={isLoggedIn}>
      {viewMode === "list" ? (
        <NearbySnapList
          snaps={visibleSnaps}
          viewerLocation={location}
          isLoading={isLoggedIn && query.isLoading}
          empty={statusNode}
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
                resolution={snap.resolution}
                key={snapId}
              />
            );
          })}
        </UnifiedMap>
      )}
      <MapListToggle mode={viewMode} onChange={setViewMode} />
      {viewMode === "map" ? statusNode : null}
    </TagsFilter>
  );
};

export default NowHereMap;
