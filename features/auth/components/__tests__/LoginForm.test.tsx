import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";
import { cleanup, render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { useLogin } from "../../hooks/use-auth-mutations";
import { LoginForm } from "../LoginForm";

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
  useLogin: jest.fn(),
}));

const mockUseLogin = useLogin as jest.Mock;

function renderLoginForm() {
  return render(
    <I18nextProvider i18n={i18n}>
      <LoginForm />
    </I18nextProvider>,
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    mockUseLogin.mockReturnValue({
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

  it("renders login copy", () => {
    const { getByText, getByPlaceholderText } = renderLoginForm();

    expect(getByText("Sign in")).toBeTruthy();
    expect(getByText("Welcome To NowHere")).toBeTruthy();
    expect(getByPlaceholderText("Email..")).toBeTruthy();
    expect(getByPlaceholderText("Password..")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();
  });

  it("renders German login copy", async () => {
    await i18n.changeLanguage("de");
    const { getByText, getByPlaceholderText, getAllByText } =
      renderLoginForm();

    expect(getByText("Willkommen bei NowHere")).toBeTruthy();
    expect(getByPlaceholderText("E-Mail..")).toBeTruthy();
    expect(getByText("Registrieren")).toBeTruthy();
    expect(getAllByText("Anmelden").length).toBeGreaterThan(0);
  });

  it("shows lockout copy for ACCOUNT_LOCKED", () => {
    mockUseLogin.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: true,
      error: ApiError.fromResponse(401, {
        title: "Locked",
        status: 401,
        detail: "Too many failed login attempts",
        code: "ACCOUNT_LOCKED",
      }),
    });

    const { getByText } = renderLoginForm();
    expect(
      getByText("Too many failed attempts. Try again in 15 minutes."),
    ).toBeTruthy();
  });

  it("shows German lockout copy for HTTP 423", async () => {
    await i18n.changeLanguage("de");
    mockUseLogin.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isError: true,
      error: ApiError.fromResponse(423, {
        title: "Locked",
        status: 423,
        detail: "Please wait before trying again",
      }),
    });

    const { getByText } = renderLoginForm();
    expect(
      getByText("Zu viele Fehlversuche. Versuche es in 15 Minuten erneut."),
    ).toBeTruthy();
  });
});
