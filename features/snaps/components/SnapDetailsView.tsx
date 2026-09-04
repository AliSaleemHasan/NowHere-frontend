import {
  formatDistanceAway,
  formatLatLng,
  openMapsAt,
} from "@/lib/geo";
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
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SnapStatus } from "../types/snaps-api-type";
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
  onDelete?: () => void;
  onHide?: () => void;
  isDeleting?: boolean;
};

const TAG_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  SOCIAL: "people-outline",
  INTERESTING: "sparkles-outline",
  HIDDEN_GEM: "diamond-outline",
  FINDINGS: "search-outline",
  LOST: "help-circle-outline",
  PROMOTION: "megaphone-outline",
  PROOMOTION: "megaphone-outline",
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
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
  onDelete,
  onHide,
  isDeleting = false,
}: SnapDetailsViewProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const showDelete = Boolean(isOwnSnap && onDelete);
  const showActions = Boolean(onHide || showDelete);

  const color = tagColor(tag);
  const postedLong = formatRelativeTime(createdAt, Date.now(), "long");
  const postedShort = formatRelativeTime(createdAt, Date.now(), "short");
  const remaining = formatRemainingVisibility(createdAt, lifetimeDays);
  const distanceLabel =
    distanceMeters == null
      ? t("snaps.details.nearby")
      : formatDistanceAway(distanceMeters);
  const caption = description.trim();
  const showImage = Boolean(authorImage) && !avatarFailed;
  const initials = initialsFromName(authorName);
  const heroHeight = Math.min(Math.max(height * 0.42, 280), 460);
  const tagIcon = TAG_ICONS[tag] ?? "pricetag-outline";

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
                    source={{ uri: authorImage }}
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
              value={distanceLabel.replace(" away", "")}
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
              <Ionicons name={tagIcon} size={18} color={color} />
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
              {onHide ? (
                <Pressable
                  testID="snap-hide"
                  onPress={onHide}
                  disabled={isDeleting}
                  accessibilityRole="button"
                  accessibilityLabel={t("snaps.details.hide")}
                  className="flex-row items-center px-4 py-4"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Ionicons name="eye-off-outline" size={18} color="#0f0d23" />
                  </View>
                  <Text className="ml-3 flex-1 text-base font-medium text-primary">
                    {t("snaps.details.hide")}
                  </Text>
                </Pressable>
              ) : null}
              {onHide && showDelete ? <View className="h-px bg-gray-100" /> : null}
              {showDelete ? (
                <Pressable
                  testID="snap-delete"
                  onPress={onDelete}
                  disabled={isDeleting}
                  accessibilityRole="button"
                  accessibilityLabel={t("snaps.details.delete")}
                  className="flex-row items-center px-4 py-4"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-full bg-red-50">
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </View>
                  <Text className="ml-3 flex-1 text-base font-medium text-error">
                    {t("snaps.details.delete")}
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
