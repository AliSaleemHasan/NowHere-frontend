import { useUserLocation } from "@/context/user-location-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import MapView, { Marker } from "react-native-maps";

export default function Index() {
  const { state } = useUserLocation();
  const [marker, setMarker] = useState<boolean>(false); // number of markers for now

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
          ></Marker>
        )}
      </MapView>
      <TouchableOpacity
        onPress={() => setMarker(true)}
        className="absolute bottom-5 right-6  bg-white  py-4 px-4 rounded-full"
      >
        <FontAwesome size={16} name="camera" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
