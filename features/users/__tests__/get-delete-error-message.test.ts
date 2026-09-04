import { ApiError } from "@/lib/http/api-error";
import { i18n } from "@/lib/i18n";
import {
  getDeleteAccountErrorMessage,
  isAccountDeleteIncompleteError,
} from "../get-delete-error-message";

const incomplete = () => i18n.t("users.settings.deleteIncomplete");
const fallback = () => i18n.t("users.settings.deleteErrorFallback");

describe("getDeleteAccountErrorMessage", () => {
  it("maps ApiError.code ACCOUNT_DELETE_INCOMPLETE", () => {
    const error = ApiError.fromResponse(500, {
      title: "Internal Server Error",
      status: 500,
      detail: "Account deletion did not complete",
      code: "ACCOUNT_DELETE_INCOMPLETE",
    });

    expect(isAccountDeleteIncompleteError(error)).toBe(true);
    expect(
      getDeleteAccountErrorMessage(error, incomplete(), fallback()),
    ).toBe(incomplete());
  });

  it("does not treat a generic 500 as incomplete deletion", () => {
    const error = ApiError.fromResponse(500, {
      title: "Internal Server Error",
      status: 500,
      detail: "Server error occurred. Please try again later.",
    });

    expect(isAccountDeleteIncompleteError(error)).toBe(false);
    expect(
      getDeleteAccountErrorMessage(error, incomplete(), fallback()),
    ).toBe("Server error occurred. Please try again later.");
  });
});
