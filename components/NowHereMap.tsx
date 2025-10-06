import TagsFilter from "@/features/map/components/TagsFilter";
import MapMarker from "@/features/snaps/components/MapMarker";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Map from "react-native-maps";
import Toast from "react-native-toast-message";

const NowHereMap = () => {
  const query = useSnapSocket();
  const mapRef = useRef<Map>(null);
  const location = useLocation((state) => state.location);
  const setLocation = useLocation((state) => state.setLocation);

  useEffect(() => {
    if (!mapRef.current || !location.coordinates) return;
    mapRef.current.animateToRegion(
      {
        longitude: location.coordinates[0],
        latitude: location.coordinates[1],
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      1000
    );
  }, [mapRef, location]);
  if (query.error) {
    Toast.show({
      type: "error",
      swipeable: true,
      position: "bottom",
      bottomOffset: 100,

      text1: "Something wrong happened when fetching snaps",
      text2: query.error.message,
      text1Style: { flexWrap: "wrap" },

      onPress: () => {
        query.refetch();
      },
    });
  }

  return (
    <TagsFilter>
      <Map
        style={styles.map}
        showsUserLocation
        showsBuildings
        showsCompass
        ref={mapRef}
        userInterfaceStyle="dark"
        userLocationUpdateInterval={1000}
        onUserLocationChange={(event) => {
          if (event.nativeEvent.coordinate)
            setLocation({
              type: "Point",
              coordinates: [
                event.nativeEvent.coordinate?.longitude,
                event.nativeEvent.coordinate?.latitude,
              ],
            });
        }}
      >
        {query.data?.success &&
          query.data.data?.map((snap, idx) => (
            <MapMarker
              _id={snap._id}
              lat={snap.location.coordinates[1]}
              lng={snap.location.coordinates[0]}
              tag={snap.tag}
              key={snap._id}
            ></MapMarker>
          ))}
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
