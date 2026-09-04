import { i18n } from "@/lib/i18n";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import MapListToggle from "../MapListToggle";

function renderToggle(
  mode: "map" | "list" = "map",
  onChange = jest.fn(),
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <MapListToggle mode={mode} onChange={onChange} />
    </I18nextProvider>,
  );
}

describe("MapListToggle", () => {
  it("renders map and list tabs with icons", () => {
    const { getByTestId, getByText } = renderToggle();

    expect(getByTestId("map-list-toggle")).toBeTruthy();
    expect(getByText("Map")).toBeTruthy();
    expect(getByText("List")).toBeTruthy();
    expect(getByTestId("map-list-toggle-map").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
  });

  it("notifies when the list tab is pressed", () => {
    const onChange = jest.fn();
    const { getByTestId } = renderToggle("map", onChange);

    fireEvent.press(getByTestId("map-list-toggle-list"));
    expect(onChange).toHaveBeenCalledWith("list");
  });
});
