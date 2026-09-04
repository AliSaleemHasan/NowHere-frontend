import { i18n } from "@/lib/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { DeleteAccountSection } from "../DeleteAccountSection";

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("../../api/delete-account", () => ({
  deleteAccount: jest.fn(),
}));

function renderDeleteSection() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <DeleteAccountSection onDeleted={jest.fn()} />
      </I18nextProvider>
    </QueryClientProvider>,
  );
}

function isDisabled(element: {
  props: { disabled?: boolean; accessibilityState?: { disabled?: boolean } };
}) {
  return Boolean(
    element.props.disabled ?? element.props.accessibilityState?.disabled,
  );
}

describe("DeleteAccountSection", () => {
  afterEach(async () => {
    cleanup();
    await i18n.changeLanguage("en");
  });

  it("disables the delete button when the password is empty", () => {
    const { getByTestId } = renderDeleteSection();
    expect(isDisabled(getByTestId("delete-account-submit"))).toBe(true);
  });

  it("enables the delete button after a password is entered", () => {
    const { getByTestId } = renderDeleteSection();

    fireEvent.changeText(getByTestId("delete-account-password"), "Secret1!");

    expect(isDisabled(getByTestId("delete-account-submit"))).toBe(false);
  });

  it("keeps the button disabled for whitespace-only passwords", () => {
    const { getByTestId } = renderDeleteSection();

    fireEvent.changeText(getByTestId("delete-account-password"), "   ");

    expect(isDisabled(getByTestId("delete-account-submit"))).toBe(true);
  });
});
