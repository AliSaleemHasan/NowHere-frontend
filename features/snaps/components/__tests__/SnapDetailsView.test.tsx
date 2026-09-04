import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { i18n } from "@/lib/i18n";
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
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider initialMetrics={insets}>
        <SnapDetailsView {...defaults} {...props} />
      </SafeAreaProvider>
    </I18nextProvider>,
  );
}

describe("SnapDetailsView", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(now);
    jest.clearAllMocks();
    await i18n.changeLanguage("en");
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

  it("shows delete only when the snap is the viewer’s", () => {
    const onDelete = jest.fn();
    const onHide = jest.fn();

    const other = renderDetails({
      isOwnSnap: false,
      onDelete,
      onHide,
    });
    expect(other.queryByTestId("snap-delete")).toBeNull();
    expect(other.getByTestId("snap-hide")).toBeTruthy();

    const own = renderDetails({
      isOwnSnap: true,
      onDelete,
      onHide,
    });
    expect(own.getByTestId("snap-delete")).toBeTruthy();
    expect(own.getByTestId("snap-hide")).toBeTruthy();

    fireEvent.press(own.getByTestId("snap-delete"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("hides delete when isOwnSnap is true but no delete handler is passed", () => {
    const { queryByTestId } = renderDetails({ isOwnSnap: true });
    expect(queryByTestId("snap-delete")).toBeNull();
    expect(queryByTestId("snap-hide")).toBeNull();
  });

  it("shows deleting copy while a delete is pending", () => {
    const { getByLabelText, queryByText } = renderDetails({
      isOwnSnap: true,
      onDelete: jest.fn(),
      isDeleting: true,
    });

    expect(getByLabelText("Deleting…")).toBeTruthy();
    expect(queryByText("Delete")).toBeNull();
  });
});
