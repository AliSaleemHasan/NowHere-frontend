import { ApiError } from "../api-error";

describe("ApiError", () => {
  it("prefers RFC 9457 validation errors", () => {
    const error = ApiError.fromResponse(400, {
      type: "about:blank",
      title: "Bad Request",
      status: 400,
      detail: "Validation failed",
      instance: "/auth/signup",
      timestamp: "2026-09-03T12:00:00.000Z",
      errors: ["Password too weak", "Email is required"],
    });

    expect(error.message).toBe("Password too weak, Email is required");
    expect(error.problemDetails?.errors).toEqual([
      "Password too weak",
      "Email is required",
    ]);
  });

  it("uses detail when there are no field errors", () => {
    const error = ApiError.fromResponse(401, {
      title: "Unauthorized",
      status: 401,
      detail: "Invalid email or password",
    });

    expect(error.message).toBe("Invalid email or password");
  });

  it("maps 429 to a throttle message", () => {
    expect(ApiError.getDefaultStatusMessage(429)).toMatch(/Too many attempts/);
  });

  it("uses a generic session message for 401, not login copy", () => {
    expect(ApiError.getDefaultStatusMessage(401)).toMatch(/session has expired/i);
  });
});
