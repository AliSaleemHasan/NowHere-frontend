import { useUserLocation } from "@/context/user-location-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Index() {
  const router = useRouter();
  const { state } = useUserLocation();
  const [marker, setMarker] = useState<string>(); // number of markers for now

  return (
    <View className="flex-1 relative">
      <MapView
        style={styles.map}
        showsUserLocation
        userLocationUpdateInterval={10000}
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
      >
        {marker && (
          <Marker
            coordinate={{
              latitude: state.coords?.latitude || 0,
              longitude: state.coords?.longitude || 0,
            }}
          >
            <Image
              source={{ uri: marker }}
              alt="test"
              className="w-11 h-11  border-2 border-secondary"
              resizeMode="cover"
            />
          </Marker>
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
