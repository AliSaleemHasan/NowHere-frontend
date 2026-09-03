import React, { memo, useCallback } from "react";
import { useRouter } from "expo-router";
import { Tags, tagColor } from "@/utils";
import UnifiedMarker from "@/features/map/components/UnifiedMarker";

interface Props {
  id: string;
  tag: Tags;
  lat: number;
  lng: number;
}

const MapMarker = ({ id, tag, lat, lng }: Props) => {
  const markerId = id;
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
      pinColor={tagColor(tag)}
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      onPress={handlePress}
    />
  );
};

export default memo(MapMarker);

