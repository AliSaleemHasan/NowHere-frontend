import React from "react";
import { Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { IMapStrategy, UnifiedMapViewProps, UnifiedMarkerProps } from "./types";

export class ReactNativeMapsStrategy implements IMapStrategy {
  readonly id = "react-native-maps";
  readonly name = "React Native Maps (Apple/Google)";

  renderMap(props: UnifiedMapViewProps): React.ReactElement {
    const region: Region = {
      latitude: props.region.latitude,
      longitude: props.region.longitude,
      latitudeDelta: props.region.latitudeDelta ?? 0.05,
      longitudeDelta: props.region.longitudeDelta ?? 0.05,
    };

    return (
      <MapView
        className="flex-1 w-full h-full"
        initialRegion={region}
        showsUserLocation={props.showUserLocation}
      >
        {props.children}
      </MapView>
    );
  }

  renderMarker(props: UnifiedMarkerProps): React.ReactElement {
    return (
      <Marker
        key={props.id}
        coordinate={props.coordinate}
        title={props.title}
        pinColor={props.pinColor}
        onPress={props.onPress}
      >
        {props.badge ? (
          <View className="items-center" collapsable={false}>
            <View
              className="h-8 w-8 items-center justify-center rounded-full border-2 border-white"
              style={{ backgroundColor: props.pinColor ?? "#FF3B30" }}
            />
            <View
              testID="map-marker-badge"
              className="mt-0.5 rounded-full bg-emerald-600 px-1.5 py-0.5"
            >
              <Text className="text-[8px] font-bold uppercase text-white">
                {props.badge}
              </Text>
            </View>
          </View>
        ) : null}
      </Marker>
    );
  }
}
