import React, { memo, useCallback } from "react";
import { useRouter } from "expo-router";
import { Tags, TagsColors } from "@/utils";
import UnifiedMarker from "@/features/map/components/UnifiedMarker";

interface Props {
  id?: string;
  _id?: string;
  tag: Tags;
  lat: number;
  lng: number;
}

const MapMarker = ({ id, _id, tag, lat, lng }: Props) => {
  const markerId = id || _id || `${lat}-${lng}`;
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (markerId) {
      router.push(`/(snaps)/${markerId}`);
    }
  }, [markerId, router]);

  return (
    <UnifiedMarker
      id={markerId}
      title={tag}
      pinColor={TagsColors[tag]}
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      onPress={handlePress}
    />
  );
};

export default memo(MapMarker);

