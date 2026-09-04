import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";
import {
  getResetErrorMessage,
  isPasswordResetInvalidError,
} from "../get-reset-error-message";

const invalid = () => i18n.t("auth.reset.invalidToken");
const fallback = () => i18n.t("auth.reset.toastErrorFallback");

describe("getResetErrorMessage", () => {
  it("maps ApiError.code PASSWORD_RESET_INVALID", () => {
    const error = ApiError.fromResponse(400, {
      title: "Bad Request",
      status: 400,
      detail: "Password reset token is invalid",
      code: "PASSWORD_RESET_INVALID",
    });

    expect(isPasswordResetInvalidError(error)).toBe(true);
    expect(getResetErrorMessage(error, invalid(), fallback())).toBe(invalid());
  });

  it("does not treat a 400 English detail as an invalid token", () => {
    const error = ApiError.fromResponse(400, {
      title: "Bad Request",
      status: 400,
      detail: "PASSWORD_RESET_INVALID token expired",
    });

    expect(isPasswordResetInvalidError(error)).toBe(false);
    expect(getResetErrorMessage(error, invalid(), fallback())).toBe(
      "PASSWORD_RESET_INVALID token expired",
    );
  });
});
