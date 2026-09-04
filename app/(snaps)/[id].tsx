import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { deleteSnap } from "@/features/snaps/api/delete-snap";
import {
  evictSnapFromCache,
  invalidateSnapQueries,
} from "@/features/snaps/api/snap-query";
import { useSnapById } from "@/features/snaps/api/useSnap";
import SnapDetailsView from "@/features/snaps/components/SnapDetailsView";
import { useHiddenSnaps } from "@/features/snaps/context/hidden-snaps-store";
import { useLocation } from "@/features/snaps/context/location-store";
import { isValidSnapLocation } from "@/features/snaps/types/snaps-api-type";
import { useUser } from "@/features/users/api/useUser";
import { useUserSettings } from "@/features/users/api/useUserSettings";
import { useUserStore } from "@/features/users/context/user-store";
import { haversineDistanceMeters } from "@/lib/geo";
import { formatUserDisplayName } from "@/types/api";
import { displayTag, getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const ErrorBoundary = NowHereError;

function SnapUnavailable() {
  const { t } = useTranslation();
  return (
    <View
      testID="snap-unavailable"
      className="flex-1 items-center justify-center bg-gray-50 px-8"
    >
      <View className="h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
        <Ionicons name="location-outline" size={26} color="#0f0d23" />
      </View>
      <Text className="mt-4 text-center text-lg font-semibold text-primary">
        {t("snaps.details.unavailableTitle")}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-gray-500">
        {t("snaps.details.unavailableBody")}
      </Text>
    </View>
  );
}

const SnapDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ id: string }>();
  const hideSnap = useHiddenSnaps((state) => state.hideSnap);
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
  const isOwnSnap = Boolean(
    viewerId && snapCreatorId && viewerId === snapCreatorId,
  );

  const deleteMutation = useMutation({
    mutationFn: deleteSnap,
    onSuccess: (_data, snapId) => {
      evictSnapFromCache(queryClient, snapId, { mine: true });
      invalidateSnapQueries(queryClient);
      Toast.show({
        type: "success",
        text1: t("snaps.delete.successTitle"),
        text2: t("snaps.delete.successBody"),
      });
      router.back();
    },
    onError: (err: unknown) => {
      Toast.show({
        type: "error",
        text1: t("snaps.delete.errorTitle"),
        text2: getErrorMessage(err, t("snaps.delete.errorFallback")),
      });
    },
  });

  const handleDelete = useCallback(() => {
    Alert.alert(t("snaps.delete.confirmTitle"), t("snaps.delete.confirmBody"), [
      { text: t("snaps.actions.cancel"), style: "cancel" },
      {
        text: t("snaps.details.delete"),
        style: "destructive",
        onPress: () => deleteMutation.mutate(params.id),
      },
    ]);
  }, [deleteMutation, params.id, t]);

  const handleHide = useCallback(() => {
    Alert.alert(t("snaps.hide.confirmTitle"), t("snaps.hide.confirmBody"), [
      { text: t("snaps.actions.cancel"), style: "cancel" },
      {
        text: t("snaps.details.hide"),
        onPress: () => {
          hideSnap(params.id);
          evictSnapFromCache(queryClient, params.id);
          invalidateSnapQueries(queryClient);
          Toast.show({
            type: "success",
            text1: t("snaps.hide.successTitle"),
            text2: t("snaps.hide.successBody"),
          });
          router.back();
        },
      },
    ]);
  }, [hideSnap, params.id, queryClient, router, t]);

  if (isSnapLoading) {
    return <Loading cause={t("snaps.details.loading")} />;
  }

  if (isSnapError || !snap) {
    return (
      <>
        <Stack.Screen options={{ title: t("snaps.details.screenTitle") }} />
        <SnapUnavailable />
      </>
    );
  }

  const user = userPayload?.user;
  const authorName = formatUserDisplayName(user, t("snaps.details.anonymous"));
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
        isOwnSnap={isOwnSnap}
        createdAt={snap.createdAt}
        latitude={lat}
        longitude={lng}
        distanceMeters={distanceMeters}
        lifetimeDays={settings?.snapDisappearTime}
        status={snap.status}
        isDeleting={deleteMutation.isPending}
        onHide={handleHide}
        onDelete={isOwnSnap ? handleDelete : undefined}
      />
    </>
  );
};

export default SnapDetails;
