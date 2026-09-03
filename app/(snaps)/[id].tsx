import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { useSnapById } from "@/features/snaps/api/useSnap";
import SnapDetailsView from "@/features/snaps/components/SnapDetailsView";
import { useLocation } from "@/features/snaps/context/location-store";
import { isValidSnapLocation } from "@/features/snaps/types/snaps-api-type";
import { useUser } from "@/features/users/api/useUser";
import { useUserSettings } from "@/features/users/api/useUserSettings";
import { useUserStore } from "@/features/users/context/user-store";
import { haversineDistanceMeters } from "@/lib/geo";
import { formatUserDisplayName } from "@/types/api";
import { displayTag } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export const ErrorBoundary = NowHereError;

function SnapUnavailable() {
  return (
    <View
      testID="snap-unavailable"
      className="flex-1 items-center justify-center bg-gray-50 px-8"
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <Ionicons name="location-outline" size={26} color="#0f0d23" />
      </View>
      <Text className="mt-4 text-center text-lg font-semibold text-primary">
        This snap isn’t available
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
        It may have expired nearby, or the link is no longer valid.
      </Text>
    </View>
  );
}

const SnapDetails = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const {
    data: snapPayload,
    isLoading: isSnapLoading,
    isError: isSnapError,
  } = useSnapById(params.id);
  const snap = snapPayload?.snap;
  const images = snapPayload?.imageKeys ?? [];
  const snapCreatorId = snap?._userId;

  const { data: userPayload, isLoading: isUserLoading } = useUser(snapCreatorId);
  const { data: settings } = useUserSettings();
  const viewerId = useUserStore((state) => state.user?.id);
  const viewerLocation = useLocation((state) => state.location);

  if (isSnapLoading) {
    return <Loading cause="Opening this snap…" />;
  }

  if (isSnapError || !snap) {
    return (
      <>
        <Stack.Screen options={{ title: "Snap" }} />
        <SnapUnavailable />
      </>
    );
  }

  const user = userPayload?.user;
  const authorName = formatUserDisplayName(user);
  const authorImage =
    userPayload?.userImage || user?.userImage || user?.image;
  const [lng, lat] = snap.location.coordinates;
  const distanceMeters = isValidSnapLocation(viewerLocation)
    ? haversineDistanceMeters(viewerLocation.coordinates, snap.location.coordinates)
    : null;

  return (
    <>
      <Stack.Screen options={{ title: displayTag(snap.tag ?? "SOCIAL") }} />
      <SnapDetailsView
        images={images}
        tag={snap.tag ?? "SOCIAL"}
        description={snap.description ?? ""}
        authorName={authorName}
        authorBio={user?.bio}
        authorImage={authorImage}
        isAuthorLoading={Boolean(snapCreatorId) && isUserLoading}
        isOwnSnap={Boolean(viewerId && snapCreatorId && viewerId === snapCreatorId)}
        createdAt={snap.createdAt}
        latitude={lat}
        longitude={lng}
        distanceMeters={distanceMeters}
        lifetimeDays={settings?.snapDisappearTime}
        status={snap.status}
      />
    </>
  );
};

export default SnapDetails;
