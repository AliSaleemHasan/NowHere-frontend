import UnifiedMarker from "@/features/map/components/UnifiedMarker";
import { Tags, tagColor } from "@/utils";
import { useRouter } from "expo-router";
import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { isFoundResolution } from "../lib/snap-safety-actions";
import type { SnapResolution } from "../types/snaps-api-type";

interface Props {
  id: string;
  tag: Tags;
  lat: number;
  lng: number;
  resolution?: SnapResolution;
}

const MapMarker = ({ id, tag, lat, lng, resolution }: Props) => {
  const markerId = id;
  const router = useRouter();
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    if (markerId) {
      router.push(`/(snaps)/${markerId}`);
    }
  }, [markerId, router]);

  return (
    <UnifiedMarker
      id={markerId}
      title={tag}
      pinColor={tagColor(tag)}
      tag={tag}
      badge={
        isFoundResolution(resolution) ? t("snaps.resolution.found") : undefined
      }
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      onPress={handlePress}
    />
  );
};

export default memo(MapMarker);

