import { useUserLocation } from "@/context/user-location-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function Index() {
  const { state } = useUserLocation();
  const [marker, setMarker] = useState<string>(); // number of markers for now

  const handleSubmitImage = async () => {
    let results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "livePhotos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (results.canceled) return;

    try {
      const payload = new FormData();
      payload.append("file", {
        uri: results.assets[0].uri,
        name: results.assets[0].uri.split("/").pop(),
        type: `image/${results.assets[0].uri.split(".").pop()}`,
      } as any);

      await fetch("http://192.168.1.69:3000/snaps", {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMarker(results.assets[0].uri);
    } catch (err) {
      console.log("error", err);
    }
  };

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
      <TouchableOpacity
        onPress={handleSubmitImage}
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
