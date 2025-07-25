import LocationRequired from "@/components/location-required";
import useLocation from "@/hooks/useLocation";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import MapView from "react-native-maps";

export default function Index() {
  const { error, lat, long } = useLocation();
  if (error) return <LocationRequired />;
  if (!lat || !long) {
    return (
      <View className="flex items-center justify-center w-full h-full">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        style={styles.map}
        userInterfaceStyle="dark"
        showsUserLocation
        userLocationUpdateInterval={10000}
        userLocationCalloutEnabled={true}
        region={{
          latitude: lat as any,
          longitude: long as any,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
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
