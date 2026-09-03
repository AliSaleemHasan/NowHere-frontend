import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { openMapsAt } from "@/lib/geo";
import SnapDetailsView, { SnapDetailsViewProps } from "../SnapDetailsView";

jest.mock("expo-haptics", () => ({
  selectionAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@expo/vector-icons", () => {
  const ReactActual = require("react");
  const { Text } = require("react-native");
  const Icon = ({ name }: { name: string }) =>
    ReactActual.createElement(Text, null, name);
  return { Ionicons: Icon, FontAwesome: Icon };
});

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("@/lib/geo", () => {
  const actual = jest.requireActual("@/lib/geo");
  return {
    ...actual,
    openMapsAt: jest.fn().mockResolvedValue(undefined),
  };
});

jest.mock("react-native-reanimated-carousel", () => {
  const ReactActual = require("react");
  const { View } = require("react-native");
  const Carousel = ReactActual.forwardRef(
    (
      {
        data,
        renderItem,
      }: {
        data: string[];
        renderItem: (info: { item: string; index: number }) => React.ReactNode;
      },
      _ref: unknown,
    ) => (
      <View testID="snap-carousel">
        {data.map((item, index) => (
          <View key={`${item}-${index}`}>{renderItem({ item, index })}</View>
        ))}
      </View>
    ),
  );
  Carousel.displayName = "Carousel";
  return { __esModule: true, default: Carousel };
});

jest.mock("react-native-awesome-gallery", () => {
  const ReactActual = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({
      data,
      renderItem,
    }: {
      data: string[];
      renderItem: (info: { item: string; index: number }) => React.ReactNode;
    }) => (
      <View testID="awesome-gallery">
        {data.map((item, index) => (
          <View key={`${item}-${index}`}>{renderItem({ item, index })}</View>
        ))}
      </View>
    ),
  };
});

const insets = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const now = Date.parse("2026-09-03T12:00:00.000Z");

const defaults: SnapDetailsViewProps = {
  images: ["https://cdn.example/one.jpg", "https://cdn.example/two.jpg"],
  tag: "HIDDEN_GEM",
  description: "A quiet courtyard behind the market.",
  authorName: "Ada Lovelace",
  authorBio: "Collecting hidden corners.",
  authorImage: "https://cdn.example/ada.jpg",
  createdAt: "2026-09-03T10:00:00.000Z",
  latitude: 52.52,
  longitude: 13.405,
  distanceMeters: 240,
  lifetimeDays: 1,
  status: "SUCCESS",
};

function renderDetails(props: Partial<SnapDetailsViewProps> = {}) {
  return render(
    <SafeAreaProvider initialMetrics={insets}>
      <SnapDetailsView {...defaults} {...props} />
    </SafeAreaProvider>,
  );
}

describe("SnapDetailsView", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders author, caption, tag, distance, and remaining visibility", () => {
    const { getByText, getByTestId, getAllByText } = renderDetails();

    expect(getByText("Ada Lovelace")).toBeTruthy();
    expect(getByText("Collecting hidden corners.")).toBeTruthy();
    expect(getByText("A quiet courtyard behind the market.")).toBeTruthy();
    expect(getByTestId("snap-tag")).toBeTruthy();
    expect(getAllByText("Hidden gem").length).toBeGreaterThan(0);
    expect(getByText("A local spot that is easy to miss.")).toBeTruthy();
    expect(getByTestId("snap-distance")).toBeTruthy();
    expect(getByText("240 m")).toBeTruthy();
    expect(getByText("Visible for about 22 hours")).toBeTruthy();
    expect(getByTestId("snap-filmstrip")).toBeTruthy();
    expect(getByTestId("snap-photo-count")).toBeTruthy();
  });

  it("marks the viewer’s own snap and opens Maps", async () => {
    const { getByTestId } = renderDetails({ isOwnSnap: true });

    expect(getByTestId("snap-own-badge")).toBeTruthy();
    fireEvent.press(getByTestId("snap-open-maps"));

    await waitFor(() => {
      expect(openMapsAt).toHaveBeenCalledWith(52.52, 13.405);
    });
  });

  it("shows placeholders when photos and caption are missing", () => {
    const { getByTestId, getByText, queryByTestId } = renderDetails({
      images: [],
      description: "   ",
      authorBio: undefined,
      isAuthorLoading: false,
    });

    expect(getByTestId("snap-photo-placeholder")).toBeTruthy();
    expect(getByText("No caption — just the scene.")).toBeTruthy();
    expect(queryByTestId("snap-filmstrip")).toBeNull();
  });

  it("explains a failed upload", () => {
    const { getByText } = renderDetails({ status: "FAILED" });
    expect(getByText("Photos may be incomplete")).toBeTruthy();
  });

  it("opens the full-screen gallery from a photo", () => {
    const { getAllByLabelText, getByTestId } = renderDetails();
    fireEvent.press(getAllByLabelText("View photo full screen")[0]);
    expect(getByTestId("snap-gallery")).toBeTruthy();
  });
});
