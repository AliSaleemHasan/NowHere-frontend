import { formatDistanceAway } from "@/lib/geo";
import { displayTag, formatRelativeTime, tagColor } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { getSnapId, type Snap } from "../types/snaps-api-type";

type Props = {
  snap: Snap;
  onPress: () => void;
  distanceMeters?: number | null;
};

export default function SnapListRow({ snap, onPress, distanceMeters }: Props) {
  const { t } = useTranslation();
  const id = getSnapId(snap) ?? snap.id;
  const color = tagColor(snap.tag);
  const caption = snap.description.trim();
  const posted = formatRelativeTime(snap.createdAt, Date.now(), "short");
  const distance =
    distanceMeters == null ? null : formatDistanceAway(distanceMeters);

  return (
    <TouchableOpacity
      testID={`snap-row-${id}`}
      accessibilityRole="button"
      accessibilityLabel={t("snaps.list.openA11y")}
      onPress={onPress}
      className="mb-3 flex-row items-center rounded-3xl bg-white px-4 py-3 shadow-sm"
    >
      <View
        className="h-11 w-11 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}22` }}
      >
        <Ionicons name="location" size={18} color={color} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium text-primary" numberOfLines={1}>
          {displayTag(snap.tag)}
        </Text>
        <Text className="mt-0.5 text-xs text-gray-500" numberOfLines={1}>
          {caption || t("snaps.list.noCaption")}
        </Text>
        {distance ? (
          <Text className="mt-0.5 text-[10px] text-gray-400">{distance}</Text>
        ) : null}
      </View>
      {posted ? (
        <Text className="mr-1 text-[10px] text-gray-400">{posted}</Text>
      ) : null}
      <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
    </TouchableOpacity>
  );
}
