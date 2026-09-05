import {
  formatDistanceAway,
  formatLatLng,
  openMapsAt,
} from "@/lib/geo";
import TagIcon from "@/components/TagIcon";
import { publicObjectUrl } from "@/lib/storage-url";
import {
  displayTag,
  formatRelativeTime,
  formatRemainingVisibility,
  tagColor,
  tagDescription,
} from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SnapResolution, SnapStatus } from "../types/snaps-api-type";
import FoundBadge from "./FoundBadge";
import SnapPhotoHero from "./SnapPhotoHero";

export type SnapDetailsViewProps = {
  images: string[];
  tag: string;
  description: string;
  authorName: string;
  authorBio?: string;
  authorImage?: string;
  isAuthorLoading?: boolean;
  isOwnSnap?: boolean;
  createdAt?: string;
  latitude: number;
  longitude: number;
  distanceMeters?: number | null;
  lifetimeDays?: number;
  status?: SnapStatus;
  resolution?: SnapResolution;
  resolutionNote?: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onReport?: () => void;
  onFound?: () => void;
  onReopen?: () => void;
  onDelete?: () => void;
  onHide?: () => void;
  isDeleting?: boolean;
  isSaving?: boolean;
  isUnsaving?: boolean;
  isReporting?: boolean;
  isResolving?: boolean;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function ActionRow({
  testID,
  icon,
  iconColor,
  iconBg,
  label,
  onPress,
  disabled,
  loading = false,
}: {
  testID: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      accessibilityLabel={label}
      className={`flex-row items-center px-4 py-4 ${disabled ? "opacity-60" : ""}`}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <Ionicons name={icon} size={18} color={iconColor} />
        )}
      </View>
      <Text className="ml-3 flex-1 text-base font-medium text-primary">
        {label}
      </Text>
    </Pressable>
  );
}

function StatCell({
  icon,
  label,
  value,
  testID,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  testID?: string;
}) {
  return (
    <View className="flex-1 items-center px-1" testID={testID}>
      <Ionicons name={icon} size={16} color="#0f0d23" />
      <Text
        className="mt-1.5 text-center text-sm font-semibold text-primary"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {value}
      </Text>
      <Text className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </Text>
    </View>
  );
}

export default function SnapDetailsView({
  images,
  tag,
  description,
  authorName,
  authorBio,
  authorImage,
  isAuthorLoading = false,
  isOwnSnap = false,
  createdAt,
  latitude,
  longitude,
  distanceMeters,
  lifetimeDays,
  status,
  resolution,
  resolutionNote,
  isSaved = false,
  onToggleSave,
  onReport,
  onFound,
  onReopen,
  onDelete,
  onHide,
  isDeleting = false,
  isSaving = false,
  isUnsaving = false,
  isReporting = false,
  isResolving = false,
}: SnapDetailsViewProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showDelete = Boolean(isOwnSnap && onDelete);
  const actionsLocked =
    isDeleting || isSaving || isUnsaving || isReporting || isResolving;
  const showActions = Boolean(
    onToggleSave || onReport || onFound || onReopen || onHide || showDelete,
  );
  const isFound = resolution === "FOUND";

  const color = tagColor(tag);
  const postedLong = formatRelativeTime(createdAt, Date.now(), "long");
  const postedShort = formatRelativeTime(createdAt, Date.now(), "short");
  const remaining = formatRemainingVisibility(createdAt, lifetimeDays);
  const distanceLabel =
    distanceMeters == null
      ? t("snaps.details.nearby")
      : formatDistanceAway(distanceMeters);
  const distanceShort =
    distanceMeters == null
      ? t("snaps.details.nearby")
      : formatDistanceAway(distanceMeters, "short");
  const caption = description.trim();
  const authorPhoto = publicObjectUrl(authorImage);
  const showImage = Boolean(authorPhoto) && !avatarFailed;
  const initials = initialsFromName(authorName);
  const heroHeight = Math.min(Math.max(height * 0.42, 280), 460);

  const statusCopy = useMemo(() => {
    if (status === "FAILED") {
      return {
        title: t("snaps.details.statusFailedTitle"),
        body: t("snaps.details.statusFailedBody"),
      };
    }
    if (status === "PROCESSING" || status === "UPLOADING") {
      return {
        title: t("snaps.details.statusProcessingTitle"),
        body: t("snaps.details.statusProcessingBody"),
      };
    }
    return null;
  }, [status, t]);

  const handleOpenMaps = async () => {
    try {
      await openMapsAt(latitude, longitude);
    } catch {
      Toast.show({
        type: "error",
        text1: t("snaps.details.mapsErrorTitle"),
        text2: t("snaps.details.mapsErrorBody"),
      });
    }
  };

  return (
    <View testID="snap-details" className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 28 }}
      >
        <SnapPhotoHero
          images={images}
          tag={tag}
          width={width}
          height={heroHeight}
        />

        <View className="px-5 pt-4">
          <View
            testID="snap-author"
            className="rounded-3xl bg-white px-4 py-4 shadow-sm"
            style={{ borderTopWidth: 4, borderTopColor: color }}
          >
            <View className="flex-row items-center">
              <View
                className="h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100"
                style={{ borderWidth: 2, borderColor: color }}
              >
                {isAuthorLoading ? (
                  <View className="h-full w-full animate-pulse bg-gray-200" />
                ) : showImage ? (
                  <Image
                    source={{ uri: authorPhoto }}
                    className="h-full w-full"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <Text className="text-base font-bold text-primary">
                    {initials}
                  </Text>
                )}
              </View>

              <View className="ml-3 flex-1">
                <View className="flex-row items-center">
                  <Text
                    className="flex-shrink text-lg font-semibold text-primary"
                    numberOfLines={1}
                  >
                    {isAuthorLoading ? t("snaps.details.loadingAuthor") : authorName}
                  </Text>
                  {isOwnSnap ? (
                    <View
                      testID="snap-own-badge"
                      className="ml-2 rounded-full bg-secondary px-2 py-0.5"
                    >
                      <Text className="text-[10px] font-bold uppercase text-primary">
                        {t("snaps.details.you")}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {authorBio ? (
                  <Text className="mt-0.5 text-xs leading-4 text-gray-500" numberOfLines={2}>
                    {authorBio}
                  </Text>
                ) : (
                  <Text className="mt-0.5 text-xs text-gray-400">
                    {isOwnSnap
                      ? t("snaps.details.ownFallbackBio")
                      : t("snaps.details.otherFallbackBio")}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View className="mt-3 flex-row rounded-3xl bg-white py-4 shadow-sm">
            <StatCell
              icon="navigate-outline"
              label={t("snaps.details.distance")}
              value={distanceShort}
              testID="snap-distance"
            />
            <View className="w-px bg-gray-100" />
            <StatCell
              icon="time-outline"
              label={t("snaps.details.posted")}
              value={postedShort ?? t("snaps.details.recently")}
              testID="snap-posted"
            />
            <View className="w-px bg-gray-100" />
            <StatCell
              icon="images-outline"
              label={t("snaps.details.photos")}
              value={String(images.length)}
              testID="snap-photo-stat"
            />
          </View>

          {isFound ? (
            <View
              testID="snap-found-banner"
              className="mt-3 rounded-3xl bg-emerald-50 px-4 py-3"
            >
              <View className="flex-row items-center">
                <FoundBadge />
              </View>
              {resolutionNote ? (
                <Text
                  testID="snap-resolution-note"
                  className="mt-2 text-sm leading-5 text-emerald-900"
                >
                  {resolutionNote}
                </Text>
              ) : null}
            </View>
          ) : null}

          {statusCopy ? (
            <View className="mt-3 rounded-3xl bg-amber-50 px-4 py-3">
              <Text className="text-sm font-semibold text-amber-900">
                {statusCopy.title}
              </Text>
              <Text className="mt-1 text-xs leading-4 text-amber-800">
                {statusCopy.body}
              </Text>
            </View>
          ) : null}

          <View className="mt-3 rounded-3xl bg-white px-4 py-4 shadow-sm">
            <Text className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {t("snaps.details.caption")}
            </Text>
            <Text
              testID="snap-description"
              className={`mt-2 text-base leading-6 ${caption ? "text-primary" : "text-gray-400"}`}
            >
              {caption || t("snaps.details.noCaption")}
            </Text>
          </View>

          <View
            testID="snap-location"
            className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm"
          >
            <View className="flex-row items-start px-4 pt-4">
              <View
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${color}22` }}
              >
                <Ionicons name="location" size={18} color={color} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-primary">
                  {distanceLabel}
                </Text>
                <Text className="mt-0.5 text-xs text-gray-500">
                  {formatLatLng(latitude, longitude)}
                </Text>
                {postedLong ? (
                  <Text className="mt-1 text-xs text-gray-400">{postedLong}</Text>
                ) : null}
              </View>
            </View>

            {remaining ? (
              <View
                testID="snap-visibility"
                className="mx-4 mt-3 flex-row items-center rounded-2xl bg-gray-50 px-3 py-2"
              >
                <Ionicons name="hourglass-outline" size={14} color="#6b7280" />
                <Text className="ml-2 flex-1 text-xs text-gray-600">
                  {remaining}
                </Text>
              </View>
            ) : null}

            <Pressable
              testID="snap-open-maps"
              onPress={handleOpenMaps}
              accessibilityRole="button"
              accessibilityLabel={t("snaps.details.openMapsA11y")}
              className="mx-4 mb-4 mt-3 flex-row items-center justify-center rounded-full bg-primary py-3"
            >
              <Ionicons name="map-outline" size={16} color="#ffffff" />
              <Text className="ml-2 text-sm font-semibold text-white">
                {t("snaps.details.openMaps")}
              </Text>
            </Pressable>
          </View>

          <View className="mt-3 flex-row items-start rounded-3xl bg-white px-4 py-4 shadow-sm">
            <View
              className="h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}22` }}
            >
              <TagIcon tag={tag} size={18} color={color} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-sm font-semibold text-primary">
                {displayTag(tag)}
              </Text>
              <Text className="mt-1 text-xs leading-4 text-gray-500">
                {tagDescription(tag)}
              </Text>
            </View>
          </View>

          {showActions ? (
            <View className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm">
              {onToggleSave ? (
                <ActionRow
                  testID="snap-save"
                  icon={
                    isSaved || isUnsaving ? "bookmark" : "bookmark-outline"
                  }
                  iconColor="#0f0d23"
                  iconBg="#f3f4f6"
                  label={
                    isUnsaving
                      ? t("snaps.details.unsaving")
                      : isSaving
                        ? t("snaps.details.saving")
                        : isSaved
                          ? t("snaps.details.saved")
                          : t("snaps.details.save")
                  }
                  onPress={onToggleSave}
                  disabled={actionsLocked}
                  loading={isSaving || isUnsaving}
                />
              ) : null}
              {onToggleSave && onReport ? (
                <View className="h-px bg-gray-100" />
              ) : null}
              {onReport ? (
                <ActionRow
                  testID="snap-report"
                  icon="flag-outline"
                  iconColor="#b45309"
                  iconBg="#fffbeb"
                  label={t("snaps.details.report")}
                  onPress={onReport}
                  disabled={actionsLocked}
                  loading={isReporting}
                />
              ) : null}
              {(onToggleSave || onReport) && (onFound || onReopen) ? (
                <View className="h-px bg-gray-100" />
              ) : null}
              {onFound ? (
                <ActionRow
                  testID="snap-found"
                  icon="checkmark-circle-outline"
                  iconColor="#047857"
                  iconBg="#ecfdf5"
                  label={t("snaps.details.markFound")}
                  onPress={onFound}
                  disabled={actionsLocked}
                  loading={isResolving}
                />
              ) : null}
              {onReopen ? (
                <ActionRow
                  testID="snap-reopen"
                  icon="refresh-outline"
                  iconColor="#0f0d23"
                  iconBg="#f3f4f6"
                  label={t("snaps.details.reopen")}
                  onPress={onReopen}
                  disabled={actionsLocked}
                  loading={isResolving}
                />
              ) : null}
              {(onToggleSave || onReport || onFound || onReopen) &&
              (onHide || showDelete) ? (
                <View className="h-px bg-gray-100" />
              ) : null}
              {onHide ? (
                <ActionRow
                  testID="snap-hide"
                  icon="eye-off-outline"
                  iconColor="#0f0d23"
                  iconBg="#f3f4f6"
                  label={t("snaps.details.hide")}
                  onPress={onHide}
                  disabled={actionsLocked}
                />
              ) : null}
              {onHide && showDelete ? <View className="h-px bg-gray-100" /> : null}
              {showDelete ? (
                <Pressable
                  testID="snap-delete"
                  onPress={onDelete}
                  disabled={actionsLocked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: actionsLocked }}
                  accessibilityLabel={
                    isDeleting
                      ? t("snaps.details.deleting")
                      : t("snaps.details.delete")
                  }
                  className={`flex-row items-center px-4 py-4 ${actionsLocked ? "opacity-60" : ""}`}
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#ef4444" />
                    ) : (
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    )}
                  </View>
                  <Text className="ml-3 flex-1 text-base font-medium text-error">
                    {isDeleting
                      ? t("snaps.details.deleting")
                      : t("snaps.details.delete")}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
