import Loading from "@/components/loading";
import MapMarker from "@/features/snaps/components/map-marker";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

export default function Index() {
  const location = useLocation((state) => state.location);
  const router = useRouter();
  const query = useSnapSocket();

  if (query.isLoading) return <Loading></Loading>;

  return (
    <View className="flex-1 relative">
      <MapView
        style={styles.map}
        showsUserLocation
        showsBuildings
        showsCompass
        // onUserLocationChange={(event) => event.nativeEvent.coordinate}
        initialRegion={{
          longitude: location.coordinates[0],
          latitude: location.coordinates[1],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {query.data?.success &&
          query.data.data?.map((snap, idx) => (
            <MapMarker snap={snap} key={snap._id}></MapMarker>
          ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
