import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { i18n } from "@/lib/i18n";
import { REPORT_REASONS } from "../../types/report-reasons";
import ReportSnapSheet from "../ReportSnapSheet";

const insets = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe("ReportSnapSheet", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders chips for only the four enum reasons", () => {
    const { getByTestId, queryByTestId } = render(
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider initialMetrics={insets}>
          <ReportSnapSheet visible onClose={jest.fn()} onSubmit={jest.fn()} />
        </SafeAreaProvider>
      </I18nextProvider>,
    );

    for (const reason of REPORT_REASONS) {
      expect(getByTestId(`report-reason-${reason}`)).toBeTruthy();
    }
    expect(queryByTestId("report-reason-scam")).toBeNull();
  });

  it("submits the selected enum reason and optional details", () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = render(
      <I18nextProvider i18n={i18n}>
        <SafeAreaProvider initialMetrics={insets}>
          <ReportSnapSheet visible onClose={jest.fn()} onSubmit={onSubmit} />
        </SafeAreaProvider>
      </I18nextProvider>,
    );

    fireEvent.press(getByTestId("report-reason-wrong_place"));
    fireEvent.changeText(getByTestId("report-details"), "  on the wrong street  ");
    fireEvent.press(getByText("Send report"));

    expect(onSubmit).toHaveBeenCalledWith({
      reason: "wrong_place",
      details: "on the wrong street",
    });
  });
});
