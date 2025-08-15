import { TagsColors } from "@/utils";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { Marker } from "react-native-maps";
import { FindSnapResponse } from "../types/snaps-api-type";

interface Props {
  snap: FindSnapResponse;
}
const MapMarker = ({ snap }: Props) => {
  const router = useRouter();
  return (
    <Marker
      tracksViewChanges={false}
      pinColor={TagsColors[snap.tag]}
      onPress={() => {
        router.push(`/(snaps)/${snap._id}`);
      }}
      title={snap.tag}
      coordinate={{
        latitude: snap.location.coordinates[1],
        longitude: snap.location.coordinates[0],
      }}
    ></Marker>
  );
};

export default memo(MapMarker);
