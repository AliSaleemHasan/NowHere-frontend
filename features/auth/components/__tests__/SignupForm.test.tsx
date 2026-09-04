import { render } from "@testing-library/react-native";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "@/lib/i18n";
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
  useSignup: () => ({
    mutate: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

describe("SignupForm", () => {
  it("renders signup copy", () => {
    const { getByText, getByPlaceholderText } = render(
      <I18nextProvider i18n={i18n}>
        <SignupForm />
      </I18nextProvider>,
    );

    expect(getByText("Sign up")).toBeTruthy();
    expect(getByText("Welcome To NowHere")).toBeTruthy();
    expect(getByPlaceholderText("Email..")).toBeTruthy();
    expect(getByPlaceholderText("Password..")).toBeTruthy();
    expect(getByText("Signup")).toBeTruthy();
    expect(getByText("Log in")).toBeTruthy();
  });
});
