import Loading from "@/components/Loading";
import NowHereError from "@/components/Nowhere-Error";
import { deleteSnap } from "@/features/snaps/api/delete-snap";
import {
  isDuplicateReportError,
  reportSnap,
} from "@/features/snaps/api/report-snap";
import {
  evictSnapFromCache,
  invalidateSnapQueries,
  patchCachedSnap,
  snapQueryKeys,
} from "@/features/snaps/api/snap-query";
import {
  markSnapFound,
  reopenSnap,
} from "@/features/snaps/api/snap-resolution";
import { useSnapById } from "@/features/snaps/api/useSnap";
import FoundSnapSheet from "@/features/snaps/components/FoundSnapSheet";
import ReportSnapSheet from "@/features/snaps/components/ReportSnapSheet";
import SnapDetailsView from "@/features/snaps/components/SnapDetailsView";
import { useHiddenSnaps } from "@/features/snaps/context/hidden-snaps-store";
import { useLocation } from "@/features/snaps/context/location-store";
import { snapSafetyActions } from "@/features/snaps/lib/snap-safety-actions";
import type { ReportReason } from "@/features/snaps/types/report-reasons";
import { isValidSnapLocation } from "@/features/snaps/types/snaps-api-type";
import {
  addBookmark,
  removeBookmark,
} from "@/features/users/api/bookmarks";
import { useBookmarks } from "@/features/users/api/useBookmarks";
import { userQueryKeys } from "@/features/users/api/user-query";
import { useUser } from "@/features/users/api/useUser";
import { useUserSettings } from "@/features/users/api/useUserSettings";
import { useUserStore } from "@/features/users/context/user-store";
import {
  isSnapBookmarked,
  withBookmarkAdded,
  withBookmarkRemoved,
  type SnapBookmark,
} from "@/features/users/types/bookmark-api-type";
import { haversineDistanceMeters } from "@/lib/geo";
import { formatUserDisplayName } from "@/types/api";
import { displayTag, getErrorMessage } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
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
  const [reportOpen, setReportOpen] = useState(false);
  const [foundOpen, setFoundOpen] = useState(false);
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
  const bookmarksQuery = useBookmarks();
  const viewerId = useUserStore((state) => state.user?.id);
  const viewerLocation = useLocation((state) => state.location);
  const isOwnSnap = Boolean(
    viewerId && snapCreatorId && viewerId === snapCreatorId,
  );
  const persistedSaved = isSnapBookmarked(
    bookmarksQuery.data ?? [],
    params.id,
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

  const saveMutation = useMutation({
    mutationFn: addBookmark,
    onMutate: async (snapId) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.bookmarks });
      const previous = queryClient.getQueryData<SnapBookmark[]>(
        userQueryKeys.bookmarks,
      );
      queryClient.setQueryData(
        userQueryKeys.bookmarks,
        withBookmarkAdded(previous, {
          userId: viewerId ?? "",
          snapId,
        }),
      );
      return { previous };
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("snaps.bookmark.saveSuccessTitle"),
        text2: t("snaps.bookmark.saveSuccessBody"),
      });
    },
    onError: (err: unknown, _snapId, context) => {
      if (context) {
        queryClient.setQueryData(userQueryKeys.bookmarks, context.previous);
      }
      Toast.show({
        type: "error",
        text1: t("snaps.bookmark.errorTitle"),
        text2: getErrorMessage(err, t("snaps.bookmark.errorFallback")),
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.bookmarks });
      void queryClient.invalidateQueries({ queryKey: snapQueryKeys.bookmarked });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: removeBookmark,
    onMutate: async (snapId) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.bookmarks });
      const previous = queryClient.getQueryData<SnapBookmark[]>(
        userQueryKeys.bookmarks,
      );
      queryClient.setQueryData(
        userQueryKeys.bookmarks,
        withBookmarkRemoved(previous, snapId),
      );
      return { previous };
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: t("snaps.bookmark.unsaveSuccessTitle"),
        text2: t("snaps.bookmark.unsaveSuccessBody"),
      });
    },
    onError: (err: unknown, _snapId, context) => {
      if (context) {
        queryClient.setQueryData(userQueryKeys.bookmarks, context.previous);
      }
      Toast.show({
        type: "error",
        text1: t("snaps.bookmark.errorTitle"),
        text2: getErrorMessage(err, t("snaps.bookmark.errorFallback")),
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: userQueryKeys.bookmarks });
      void queryClient.invalidateQueries({ queryKey: snapQueryKeys.bookmarked });
    },
  });

  const reportMutation = useMutation({
    mutationFn: ({
      id,
      reason,
      details,
    }: {
      id: string;
      reason: ReportReason;
      details?: string;
    }) => reportSnap(id, { reason, details }),
    onSuccess: () => {
      setReportOpen(false);
      Toast.show({
        type: "success",
        text1: t("snaps.report.successTitle"),
        text2: t("snaps.report.successBody"),
      });
    },
    onError: (err: unknown) => {
      if (isDuplicateReportError(err)) {
        setReportOpen(false);
        Toast.show({
          type: "error",
          text1: t("snaps.report.duplicateTitle"),
          text2: t("snaps.report.duplicateBody"),
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: t("snaps.report.errorTitle"),
        text2: getErrorMessage(err, t("snaps.report.errorFallback")),
      });
    },
  });

  const foundMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      markSnapFound(id, note),
    onSuccess: (updated) => {
      patchCachedSnap(queryClient, updated);
      invalidateSnapQueries(queryClient);
      setFoundOpen(false);
      Toast.show({
        type: "success",
        text1: t("snaps.found.successTitle"),
        text2: t("snaps.found.successBody"),
      });
    },
    onError: (err: unknown) => {
      Toast.show({
        type: "error",
        text1: t("snaps.found.errorTitle"),
        text2: getErrorMessage(err, t("snaps.found.errorFallback")),
      });
    },
  });

  const reopenMutation = useMutation({
    mutationFn: reopenSnap,
    onSuccess: (updated) => {
      patchCachedSnap(queryClient, updated);
      invalidateSnapQueries(queryClient);
      Toast.show({
        type: "success",
        text1: t("snaps.reopen.successTitle"),
        text2: t("snaps.reopen.successBody"),
      });
    },
    onError: (err: unknown) => {
      Toast.show({
        type: "error",
        text1: t("snaps.reopen.errorTitle"),
        text2: getErrorMessage(err, t("snaps.reopen.errorFallback")),
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

  const handleToggleSave = useCallback(() => {
    if (!params.id) return;
    if (persistedSaved) {
      unsaveMutation.mutate(params.id);
    } else {
      saveMutation.mutate(params.id);
    }
  }, [persistedSaved, params.id, saveMutation, unsaveMutation]);

  const handleReopen = useCallback(() => {
    Alert.alert(t("snaps.reopen.confirmTitle"), t("snaps.reopen.confirmBody"), [
      { text: t("snaps.actions.cancel"), style: "cancel" },
      {
        text: t("snaps.details.reopen"),
        onPress: () => reopenMutation.mutate(params.id),
      },
    ]);
  }, [params.id, reopenMutation, t]);

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
  const { showFound, showReopen } = snapSafetyActions({
    tag: snap.tag,
    resolution: snap.resolution,
    isOwnSnap,
  });

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
        resolution={snap.resolution}
        resolutionNote={snap.resolutionNote}
        isSaved={persistedSaved}
        isDeleting={deleteMutation.isPending}
        isSaving={saveMutation.isPending}
        isUnsaving={unsaveMutation.isPending}
        isReporting={reportMutation.isPending}
        isResolving={foundMutation.isPending || reopenMutation.isPending}
        onToggleSave={handleToggleSave}
        onReport={() => setReportOpen(true)}
        onFound={showFound ? () => setFoundOpen(true) : undefined}
        onReopen={showReopen ? handleReopen : undefined}
        onHide={handleHide}
        onDelete={isOwnSnap ? handleDelete : undefined}
      />
      <ReportSnapSheet
        visible={reportOpen}
        onClose={() => setReportOpen(false)}
        isSubmitting={reportMutation.isPending}
        onSubmit={({ reason, details }) =>
          reportMutation.mutate({ id: params.id, reason, details })
        }
      />
      <FoundSnapSheet
        visible={foundOpen}
        onClose={() => setFoundOpen(false)}
        isSubmitting={foundMutation.isPending}
        onSubmit={(note) => foundMutation.mutate({ id: params.id, note })}
      />
    </>
  );
};

export default SnapDetails;
