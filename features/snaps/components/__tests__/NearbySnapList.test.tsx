import { i18n } from "@/lib/i18n";
import { render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import { I18nextProvider } from "react-i18next";
import { Tags } from "@/utils";
import type { Snap } from "../../types/snaps-api-type";
import NearbySnapList from "../NearbySnapList";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const snap: Snap = {
  id: "snap-1",
  _id: "snap-1",
  _userId: "user-1",
  description: "A bench by the canal",
  snaps: ["https://cdn.example/photo.jpg"],
  location: { type: "Point", coordinates: [13.4, 52.5] },
  tag: Tags.SOCIAL,
  resolution: "OPEN",
  createdAt: new Date().toISOString(),
};

describe("NearbySnapList", () => {
  it("renders rows without a status-bar spacer", () => {
    const { getByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <NearbySnapList snaps={[snap]} />
      </I18nextProvider>,
    );

    expect(getByTestId("nearby-snap-list")).toBeTruthy();
    expect(getByTestId("snap-row-snap-1")).toBeTruthy();
  });

  it("shows the empty state when there are no snaps", () => {
    const { getByText } = render(
      <I18nextProvider i18n={i18n}>
        <NearbySnapList
          snaps={[]}
          empty={<Text>Sign in to see snaps nearby</Text>}
        />
      </I18nextProvider>,
    );

    expect(getByText("Sign in to see snaps nearby")).toBeTruthy();
  });
});
