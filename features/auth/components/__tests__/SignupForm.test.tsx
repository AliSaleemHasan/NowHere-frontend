import { cleanup, render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "@/lib/i18n";
import { useSignup } from "../../hooks/use-auth-mutations";
import { SignupForm } from "../SignupForm";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
}));

jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

jest.mock("../../hooks/use-auth-mutations", () => ({
  useSignup: jest.fn(),
}));

const mockUseSignup = useSignup as jest.Mock;

function renderSignupForm() {
  return render(
    <I18nextProvider i18n={i18n}>
      <SignupForm />
    </I18nextProvider>,
  );
}

describe("SignupForm", () => {
  beforeEach(() => {
    mockUseSignup.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: false,
      error: null,
    });
  });

  afterEach(async () => {
    cleanup();
    await i18n.changeLanguage("en");
  });

  it("renders signup copy", () => {
    const { getByText, getByPlaceholderText } = renderSignupForm();

    expect(getByText("Sign up")).toBeTruthy();
    expect(getByText("Welcome To NowHere")).toBeTruthy();
    expect(getByPlaceholderText("Email..")).toBeTruthy();
    expect(getByPlaceholderText("Password..")).toBeTruthy();
    expect(getByText("Signup")).toBeTruthy();
    expect(getByText("Log in")).toBeTruthy();
  });

  it("renders German signup copy", async () => {
    await i18n.changeLanguage("de");
    const { getByText, getByPlaceholderText, getAllByText } =
      renderSignupForm();

    expect(getByText("Willkommen bei NowHere")).toBeTruthy();
    expect(getByPlaceholderText("E-Mail..")).toBeTruthy();
    expect(getByText("Anmelden")).toBeTruthy();
    expect(getAllByText("Registrieren").length).toBeGreaterThan(0);
  });

  it("shows a translated fallback when signup fails without a message", async () => {
    mockUseSignup.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: true,
      error: null,
    });

    await i18n.changeLanguage("de");
    const { getByText } = renderSignupForm();

    expect(
      getByText("Bitte prüfe das Formular und versuche es erneut."),
    ).toBeTruthy();
  });
});
