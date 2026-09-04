import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";
import {
  getLoginErrorMessage,
  isAccountLockedError,
} from "../get-login-error-message";

const lockout = () => i18n.t("auth.login.lockout");
const fallback = () => i18n.t("auth.login.toastErrorFallback");

describe("getLoginErrorMessage", () => {
  it("maps ApiError.code ACCOUNT_LOCKED to the lockout message", () => {
    const error = ApiError.fromResponse(423, {
      title: "Locked",
      status: 423,
      detail: "Too many failed login attempts",
      code: "ACCOUNT_LOCKED",
    });

    expect(isAccountLockedError(error)).toBe(true);
    expect(getLoginErrorMessage(error, lockout(), fallback())).toBe(lockout());
  });

  it("maps HTTP 423 without a code to the lockout message", () => {
    const error = ApiError.fromResponse(423, {
      title: "Locked",
      status: 423,
      detail: "Please wait",
    });

    expect(isAccountLockedError(error)).toBe(true);
    expect(getLoginErrorMessage(error, lockout(), fallback())).toBe(lockout());
  });

  it("does not treat a 401 English detail as lockout", () => {
    const error = ApiError.fromResponse(401, {
      title: "Unauthorized",
      status: 401,
      detail: "Account is locked. ACCOUNT_LOCKED",
    });

    expect(isAccountLockedError(error)).toBe(false);
    expect(getLoginErrorMessage(error, lockout(), fallback())).toBe(
      "Account is locked. ACCOUNT_LOCKED",
    );
  });

  it("uses the generic fallback when there is no useful message", () => {
    expect(getLoginErrorMessage(null, lockout(), fallback())).toBe(fallback());
  });
});
