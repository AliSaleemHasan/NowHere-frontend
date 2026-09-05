import MapPinMark from "../components/MapPinMark";
import React from "react";
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
        <MapPinMark
          pinColor={props.pinColor}
          tag={props.tag}
          badge={props.badge}
        />
      </Marker>
    );
  }
}
