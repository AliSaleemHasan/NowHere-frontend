import { Tags, TagsColors } from "@/utils";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Marker } from "react-native-maps";

interface Props {
  _id: string;
  tag: Tags;
  lat: number;
  lng: number;
}
const MapMarker = ({ _id, tag, lat, lng }: Props) => {
  const router = useRouter();
  return (
    <Marker
      tracksViewChanges={false}
      pinColor={TagsColors[tag]}
      onPress={() => {
        router.push(`/(snaps)/${_id}`);
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
