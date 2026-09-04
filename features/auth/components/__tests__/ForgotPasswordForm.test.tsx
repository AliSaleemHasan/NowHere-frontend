import { i18n } from "@/lib/i18n";
import { cleanup, render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { useForgotPassword } from "../../hooks/use-auth-mutations";
import { ForgotPasswordForm } from "../ForgotPasswordForm";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock("../../hooks/use-auth-mutations", () => ({
  useForgotPassword: jest.fn(),
}));

const mockUseForgotPassword = useForgotPassword as jest.Mock;

function renderForgotForm() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ForgotPasswordForm />
    </I18nextProvider>,
  );
}

describe("ForgotPasswordForm", () => {
  afterEach(async () => {
    cleanup();
    await i18n.changeLanguage("en");
  });

  it("shows the generic success copy when forgot-password succeeds for an unknown email", () => {
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { getByText } = renderForgotForm();

    expect(getByText("Check your email")).toBeTruthy();
    expect(
      getByText(
        "If an account exists for that address, we sent a link to choose a new password.",
      ),
    ).toBeTruthy();
  });

  it("shows the same German success copy for an unknown email", async () => {
    await i18n.changeLanguage("de");
    mockUseForgotPassword.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    });

    const { getByText } = renderForgotForm();

    expect(getByText("Prüfe dein Postfach")).toBeTruthy();
    expect(
      getByText(
        "Wenn ein Konto mit dieser Adresse existiert, haben wir einen Link geschickt, mit dem du ein neues Passwort setzen kannst.",
      ),
    ).toBeTruthy();
  });
});
