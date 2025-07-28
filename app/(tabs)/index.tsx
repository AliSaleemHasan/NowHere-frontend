import { useUserLocation } from "@/context/user-location-context";
import { StyleSheet, View } from "react-native";

import MapView from "react-native-maps";

export default function Index() {
  const { state, fetchLocation } = useUserLocation();

  return (
    <View className="flex-1">
      <MapView
        style={styles.map}
        userInterfaceStyle="dark"
        showsUserLocation
        userLocationUpdateInterval={10000}
        userLocationCalloutEnabled={true}
        region={
          state.coords
            ? {
                latitude: state.coords?.latitude,
                longitude: state.coords?.longitude,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2,
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
