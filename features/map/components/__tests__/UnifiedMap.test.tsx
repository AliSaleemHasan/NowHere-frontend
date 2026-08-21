import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { ReactNativeMapsStrategy } from "../../strategies/ReactNativeMapsStrategy";
import UnifiedMap from "../UnifiedMap";
import UnifiedMarker from "../UnifiedMarker";

describe("UnifiedMap & UnifiedMarker Components", () => {
  const mockRegion = {
    latitude: 52.52,
    longitude: 13.405,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  test("renders with default configured MapLibre strategy", () => {
    const { getByTestId, getByText } = render(
      <UnifiedMap region={mockRegion}>
        <Text>Map Child</Text>
      </UnifiedMap>,
    );

    expect(getByTestId("maplibre-map-view")).toBeTruthy();
    expect(getByTestId("maplibre-camera")).toBeTruthy();
    expect(getByText("Map Child")).toBeTruthy();
  });

  test("renders with custom strategy passed via prop", () => {
    const customStrategy = new ReactNativeMapsStrategy();
    const { getByTestId } = render(
      <UnifiedMap region={mockRegion} strategy={customStrategy} />,
    );

    expect(getByTestId("react-native-maps-map-view")).toBeTruthy();
  });

  test("UnifiedMarker delegates to active strategy and handles click", () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <UnifiedMarker
        id="marker-test-1"
        coordinate={{ latitude: 52.52, longitude: 13.405 }}
        title="Test Point"
        pinColor="#00FF00"
        onPress={onPressMock}
      />,
    );

    const marker = getByTestId("maplibre-point-annotation");
    expect(marker).toBeTruthy();
    expect(marker.props.coordinate).toEqual([13.405, 52.52]);

    fireEvent(marker, "onSelected");
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
