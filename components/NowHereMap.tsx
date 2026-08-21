import TagsFilter from "@/features/map/components/TagsFilter";
import MapMarker from "@/features/snaps/components/MapMarker";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Map from "react-native-maps";

const NowHereMap = () => {
  const query = useSnapSocket();
  const location = useLocation((state) => state.location);
  const loading = useLocation((state) => state.loading);

  const [lng, lat] = location?.coordinates ?? [0, 0];
  const hasValidLocation = lat !== 0 || lng !== 0;

  if (!hasValidLocation || loading) {
    return (
      <View className="flex-1 w-full h-full items-center justify-center gap-3">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-gray-500">Locating...</Text>
      </View>
    );
  }

  return (
    <TagsFilter>
      <Map
        style={styles.map}
        showsUserLocation
        showsBuildings
        showsCompass
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
        userInterfaceStyle="dark"
        followsUserLocation
      >
        {query.data?.success &&
          query.data.data?.map((snap) => {
            const snapId = snap.id || snap._id;
            return (
              <MapMarker
                id={snapId}
                _id={snapId}
                lat={snap.location.coordinates[1]}
                lng={snap.location.coordinates[0]}
                tag={snap.tag}
                key={snapId}
              />
            );
          })}
      </Map>
    </TagsFilter>
  );
};

export default NowHereMap;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
