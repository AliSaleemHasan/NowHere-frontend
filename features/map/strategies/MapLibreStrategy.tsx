import React from "react";
import { View } from "react-native";
import {
  MapView,
  Camera,
  PointAnnotation,
  UserLocation,
} from "@maplibre/maplibre-react-native";
import { IMapStrategy, UnifiedMapViewProps, UnifiedMarkerProps } from "./types";

export const DEFAULT_MAPLIBRE_STYLE_URL =
  "https://tiles.openfreemap.org/styles/liberty";

export class MapLibreStrategy implements IMapStrategy {
  readonly id = "maplibre";
  readonly name = "MapLibre GL (OpenStreetMap)";

  renderMap(props: UnifiedMapViewProps): React.ReactElement {
    const centerCoordinate: [number, number] = [
      props.region.longitude,
      props.region.latitude,
    ];

    return (
      <MapView
        key={DEFAULT_MAPLIBRE_STYLE_URL}
        style={{ flex: 1, width: "100%", height: "100%" }}
        mapStyle={DEFAULT_MAPLIBRE_STYLE_URL}
      >
        <Camera
          centerCoordinate={centerCoordinate}
          zoomLevel={12}
          animationMode="flyTo"
          animationDuration={0}
        />
        {props.showUserLocation && <UserLocation visible={true} />}
        {props.children}
      </MapView>
    );
  }

  renderMarker(props: UnifiedMarkerProps): React.ReactElement {
    const coordinate: [number, number] = [
      props.coordinate.longitude,
      props.coordinate.latitude,
    ];

    return (
      <PointAnnotation
        key={props.id}
        id={props.id}
        coordinate={coordinate}
        title={props.title}
        onSelected={props.onPress}
      >
        <View
          className="h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-md"
          style={
            props.pinColor
              ? { backgroundColor: props.pinColor }
              : { backgroundColor: "#FF3B30" }
          }
        />
      </PointAnnotation>
    );
  }
}
