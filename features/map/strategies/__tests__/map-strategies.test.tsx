import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ReactNativeMapsStrategy } from "../ReactNativeMapsStrategy";
import { MapLibreStrategy } from "../MapLibreStrategy";
import { IMapStrategy, MapRegion, UnifiedMarkerProps } from "../types";

describe("Map Strategy Pattern", () => {
  const mockRegion: MapRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mockMarkerProps: UnifiedMarkerProps = {
    id: "marker-1",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
    },
    title: "Test Marker",
    pinColor: "#FF0000",
    onPress: jest.fn(),
  };

  describe("ReactNativeMapsStrategy", () => {
    let strategy: IMapStrategy;

    beforeEach(() => {
      strategy = new ReactNativeMapsStrategy();
      jest.clearAllMocks();
    });

    test("should have correct id and name", () => {
      expect(strategy.id).toBe("react-native-maps");
      expect(strategy.name).toBe("React Native Maps (Apple/Google)");
    });

    test("should render MapView with initialRegion and userLocation", () => {
      const { getByTestId } = render(
        strategy.renderMap({
          region: mockRegion,
          showUserLocation: true,
        })
      );

      const mapView = getByTestId("react-native-maps-map-view");
      expect(mapView).toBeTruthy();
      expect(mapView.props.initialRegion).toEqual(mockRegion);
      expect(mapView.props.showsUserLocation).toBe(true);
    });

    test("should render Marker and trigger onPress when pressed", () => {
      const { getByTestId } = render(strategy.renderMarker(mockMarkerProps));

      const marker = getByTestId("react-native-maps-marker");
      expect(marker).toBeTruthy();
      expect(marker.props.coordinate).toEqual(mockMarkerProps.coordinate);
      expect(marker.props.pinColor).toBe(mockMarkerProps.pinColor);

      fireEvent.press(marker);
      expect(mockMarkerProps.onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe("MapLibreStrategy", () => {
    let strategy: IMapStrategy;

    beforeEach(() => {
      strategy = new MapLibreStrategy();
      jest.clearAllMocks();
    });

    test("should have correct id and name", () => {
      expect(strategy.id).toBe("maplibre");
      expect(strategy.name).toBe("MapLibre GL (OpenStreetMap)");
    });

    test("should render MapLibreGL MapView and Camera with center coordinates", () => {
      const { getByTestId } = render(
        strategy.renderMap({
          region: mockRegion,
          showUserLocation: true,
        })
      );

      const mapView = getByTestId("maplibre-map-view");
      const camera = getByTestId("maplibre-camera");

      expect(mapView).toBeTruthy();
      expect(camera).toBeTruthy();
      // GeoJSON standard: [longitude, latitude]
      expect(camera.props.centerCoordinate).toEqual([
        mockRegion.longitude,
        mockRegion.latitude,
      ]);
    });

    test("should render PointAnnotation and trigger onPress when selected", () => {
      const { getByTestId } = render(strategy.renderMarker(mockMarkerProps));

      const marker = getByTestId("maplibre-point-annotation");
      expect(marker).toBeTruthy();
      expect(marker.props.id).toBe(mockMarkerProps.id);
      expect(marker.props.coordinate).toEqual([
        mockMarkerProps.coordinate.longitude,
        mockMarkerProps.coordinate.latitude,
      ]);

      fireEvent(marker, "onSelected");
      expect(mockMarkerProps.onPress).toHaveBeenCalledTimes(1);
    });

    test("renders a FOUND badge on the pin when provided", () => {
      const { getByTestId, getByText } = render(
        strategy.renderMarker({ ...mockMarkerProps, badge: "Found" }),
      );

      expect(getByTestId("map-marker-badge")).toBeTruthy();
      expect(getByText("Found")).toBeTruthy();
    });
  });
});
