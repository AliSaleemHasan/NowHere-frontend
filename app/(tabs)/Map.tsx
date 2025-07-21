import { StyleSheet, View } from "react-native";

import MapView from "react-native-maps";

export default function Index() {
  return (
    <View className="flex-1">
      <MapView style={styles.map} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
