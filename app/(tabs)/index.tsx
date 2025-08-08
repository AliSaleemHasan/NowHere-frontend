import { useLocation } from "@/features/snaps/context/location-store";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

export default function Index() {
  const location = useLocation((state) => state.location);

  return (
    <View className="flex-1 relative">
      <MapView
        style={styles.map}
        showsUserLocation
        userLocationUpdateInterval={10000}
        region={{
          longitude: location.coordinates[0],
          latitude: location.coordinates[1],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
