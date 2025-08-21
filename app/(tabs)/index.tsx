import Loading from "@/components/Loading";
import TagsFilter from "@/features/map/components/TagsFilter";
import { useLocation } from "@/features/snaps/context/location-store";
import { useSnapSocket } from "@/features/snaps/hooks/useSnapSocket";
import { StyleSheet, View } from "react-native";

import React from "react";
import Toast from "react-native-toast-message";
export default function Index() {
  const location = useLocation((state) => state.location);
  const query = useSnapSocket();

  if (query.isLoading) return <Loading></Loading>;

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
    <View className="flex-1 relative">
      <TagsFilter>
        {/* <MapView
          style={styles.map}
          showsUserLocation
          showsBuildings
          provider={undefined}
          showsCompass
          onUserLocationChange={(event) => event.nativeEvent.coordinate}
          initialRegion={{
            longitude: location?.coordinates?.[0] ?? 53,
            latitude: location?.coordinates?.[1] ?? 4,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {query.data?.success &&
            query.data.data?.map((snap, idx) => (
              <MapMarker snap={snap} key={snap._id}></MapMarker>
            ))}
        </MapView> */}
      </TagsFilter>
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
