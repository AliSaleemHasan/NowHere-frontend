import { Tags, TagsColors } from "@/utils";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Marker } from "react-native-maps";

interface Props {
  id?: string;
  _id?: string;
  tag: Tags;
  lat: number;
  lng: number;
}
const MapMarker = ({ id, _id, tag, lat, lng }: Props) => {
  const markerId = id || _id;
  const router = useRouter();
  return (
    <Marker
      tracksViewChanges={false}
      pinColor={TagsColors[tag]}
      onPress={() => {
        if (markerId) {
          router.push(`/(snaps)/${markerId}`);
        }
      }}
      title={tag}
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
    ></Marker>
  );
};

export default memo(MapMarker);
