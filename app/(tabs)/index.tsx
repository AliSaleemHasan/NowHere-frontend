import Loading from "@/components/loading";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Index() {
  const location = useLocation((state) => state.location);

  const query = useSnapSocket();

  if (query.isLoading) return <Loading></Loading>;

  return (
    <View className="flex-1 relative">
      <MapView
        style={styles.map}
        showsUserLocation
        userLocationUpdateInterval={10000}
        onUserLocationChange={(event) => event.nativeEvent.coordinate}
        region={{
          longitude: location.coordinates[0],
          latitude: location.coordinates[1],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {query.data?.success &&
          query.data.data?.map((snap, idx) =>
            snap.location && snap.location.coordinates ? (
              <Marker
                key={`${snap._userId}_${idx}`}
                coordinate={{
                  latitude: snap.location.coordinates[1],
                  longitude: snap.location.coordinates[0],
                }}
                title={snap._userId}
              ></Marker>
            ) : (
              <Fragment key={`${snap._userId}_${idx}`}></Fragment>
            )
          )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
