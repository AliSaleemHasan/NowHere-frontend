import ExploreChrome from "./ExploreChrome";
import { type MapViewMode } from "./MapListToggle";
import EmptyState from "@/components/EmptyState";
import { SafeScreen } from "@/components/SafeScreen";
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
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

type FeedStatus = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
};

function NearbyFeedStatus({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  overlay = false,
}: FeedStatus & { overlay?: boolean }) {
  if (!overlay) {
    return (
      <EmptyState
        icon={icon}
        title={title}
        body={body}
        actionLabel={actionLabel}
        onAction={onAction}
      />
    );
  }

  return (
    <View className="absolute bottom-6 left-5 right-5 z-40 flex-row items-start rounded-2xl bg-white px-4 py-3 shadow-sm">
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
        <Ionicons name={icon} size={18} color="#0f0d23" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-primary">{title}</Text>
        <Text className="mt-1 text-xs text-gray-500">{body}</Text>
        {actionLabel && onAction ? (
          <TouchableOpacity
            onPress={onAction}
            className="mt-3 self-start rounded-full bg-primary px-4 py-2"
          >
            <Text className="text-xs font-semibold text-white">
              {actionLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
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

  const visibleSnaps = useMemo(() => {
    const snaps = (query.data?.success ? query.data.data : undefined) ?? [];
    return filterHiddenSnaps(snaps, hiddenSnapIds);
  }, [query.data, hiddenSnapIds]);

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
      <SafeScreen className="items-center justify-center gap-3 bg-gray-50">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-gray-500">{t("map.locating")}</Text>
      </SafeScreen>
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
      icon: "cloud-offline-outline",
      title: t("map.loadErrorTitle"),
      body: t("map.loadErrorBody"),
      actionLabel: t("map.retry"),
      onAction: () => {
        void query.refetch();
      },
    };
  } else if (isLoggedIn && !query.isLoading && visibleSnaps.length === 0) {
    feedStatus = {
      icon: showSeen ? "eye-outline" : "locate-outline",
      title: emptyTitle,
      body: emptyBody,
    };
  } else if (!isLoggedIn) {
    feedStatus = {
      icon: "log-in-outline",
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
      {({ openFilter }) => (
        <View className="flex-1 bg-gray-50">
          <View
            className="flex-1"
            pointerEvents={viewMode === "map" ? "auto" : "none"}
          >
            <UnifiedMap region={mapRegion} showUserLocation>
              {visibleSnaps.map((snap) => {
                const snapId = getSnapId(snap);
                const coordinates = snap.location?.coordinates;
                if (!snapId || !coordinates || coordinates.length < 2) {
                  return null;
                }
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
          </View>

          {viewMode === "map" ? (
            <>
              <ExploreChrome
                overlay
                mode={viewMode}
                onModeChange={setViewMode}
                onOpenFilter={openFilter}
              />
              {statusNode}
            </>
          ) : (
            <View className="absolute inset-0 bg-gray-50">
              <ExploreChrome
                mode={viewMode}
                onModeChange={setViewMode}
                onOpenFilter={openFilter}
              >
                <NearbySnapList
                  snaps={visibleSnaps}
                  viewerLocation={location}
                  isLoading={isLoggedIn && query.isLoading}
                  empty={statusNode}
                />
              </ExploreChrome>
            </View>
          )}
        </View>
      )}
    </TagsFilter>
  );
};

export default NowHereMap;
