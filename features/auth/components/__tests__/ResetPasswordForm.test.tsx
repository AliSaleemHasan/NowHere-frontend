import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";
import { cleanup, render } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { useResetPassword } from "../../hooks/use-auth-mutations";
import { ResetPasswordForm } from "../ResetPasswordForm";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    navigate: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(),
}));

jest.mock("../../hooks/use-auth-mutations", () => ({
  useResetPassword: jest.fn(),
}));

const mockUseResetPassword = useResetPassword as jest.Mock;
const mockUseLocalSearchParams = useLocalSearchParams as jest.Mock;

function renderResetForm() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ResetPasswordForm />
    </I18nextProvider>,
  );
}

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReturnValue({ token: "reset-token" });
    mockUseResetPassword.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  });

  afterEach(async () => {
    cleanup();
    await i18n.changeLanguage("en");
  });

  it("maps PASSWORD_RESET_INVALID to the invalid-token copy", () => {
    mockUseResetPassword.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isSuccess: false,
      isError: true,
      error: ApiError.fromResponse(400, {
        title: "Bad Request",
        status: 400,
        detail: "Password reset token is invalid",
        code: "PASSWORD_RESET_INVALID",
      }),
    });

    const { getByText } = renderResetForm();
    expect(
      getByText("This reset link is invalid or has expired."),
    ).toBeTruthy();
  });

  it("maps PASSWORD_RESET_INVALID in German", async () => {
    await i18n.changeLanguage("de");
    mockUseResetPassword.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      isSuccess: false,
      isError: true,
      error: ApiError.fromResponse(400, {
        title: "Bad Request",
        status: 400,
        detail: "Password reset token is invalid",
        code: "PASSWORD_RESET_INVALID",
      }),
    });

    const { getByText } = renderResetForm();
    expect(getByText("Dieser Link ist ungültig oder abgelaufen.")).toBeTruthy();
  });
});
