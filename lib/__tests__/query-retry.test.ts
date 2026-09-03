import { ApiError } from "../http/api-error";
import {
  retryAfterSignupProfile,
  retryUnlessClientError,
} from "../query-retry";

describe("query retry", () => {
  it("does not retry auth failures or missing resources by default", () => {
    expect(retryUnlessClientError(0, new ApiError("nope", 401))).toBe(false);
    expect(retryUnlessClientError(0, new ApiError("gone", 404))).toBe(false);
    expect(retryUnlessClientError(0, new ApiError("boom", 500))).toBe(true);
    expect(retryUnlessClientError(2, new ApiError("boom", 500))).toBe(false);
  });

  it("retries profile 404s after signup", () => {
    expect(retryAfterSignupProfile(0, new ApiError("missing", 404))).toBe(true);
    expect(retryAfterSignupProfile(6, new ApiError("missing", 404))).toBe(
      false,
    );
    expect(retryAfterSignupProfile(0, new ApiError("denied", 403))).toBe(false);
  });
});
