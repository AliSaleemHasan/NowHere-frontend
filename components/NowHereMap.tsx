import TagsFilter from "@/features/map/components/TagsFilter";
import MapMarker from "@/features/snaps/components/MapMarker";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import React from "react";
import { StyleSheet } from "react-native";
import Map from "react-native-maps";

const NowHereMap = () => {
  const query = useSnapSocket();
  const location = useLocation((state) => state.location);
  const setLocation = useLocation((state) => state.setLocation);

  return (
    <TagsFilter>
      <Map
        style={styles.map}
        showsUserLocation
        showsBuildings
        showsCompass
        initialRegion={{
          latitude: location.coordinates[1],
          longitude: location?.coordinates[0],
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
        userInterfaceStyle="dark"
        userLocationUpdateInterval={1000} // every 10 seconds
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
