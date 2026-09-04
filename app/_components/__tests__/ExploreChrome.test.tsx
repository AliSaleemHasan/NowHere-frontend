import { i18n } from "@/lib/i18n";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ExploreChrome from "../ExploreChrome";

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function renderChrome(
  overlay: boolean,
  onModeChange = jest.fn(),
  onOpenFilter = jest.fn(),
) {
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <I18nextProvider i18n={i18n}>
        <ExploreChrome
          overlay={overlay}
          mode="list"
          onModeChange={onModeChange}
          onOpenFilter={onOpenFilter}
        >
          <Text>List body</Text>
        </ExploreChrome>
      </I18nextProvider>
    </SafeAreaProvider>,
  );
}

describe("ExploreChrome", () => {
  it("keeps list content below a distinct safe-area header", () => {
    const { getByTestId, getByText } = renderChrome(false);

    expect(getByTestId("explore-list-screen")).toBeTruthy();
    expect(getByTestId("explore-toolbar")).toBeTruthy();
    expect(getByText("Nearby snaps")).toBeTruthy();
    expect(getByText("List body")).toBeTruthy();
  });

  it("opens the filter sheet from the toolbar", () => {
    const onOpenFilter = jest.fn();
    const { getByTestId } = renderChrome(true, jest.fn(), onOpenFilter);

    fireEvent.press(getByTestId("map-filter-button"));
    expect(onOpenFilter).toHaveBeenCalledTimes(1);
  });
});
