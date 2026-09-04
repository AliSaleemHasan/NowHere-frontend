const mockApiFetch = jest.fn();

jest.mock("@/lib/fetch-api", () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

import { forgotPasswordApi, resetPasswordApi } from "../auth-api";

describe("password reset API", () => {
  beforeEach(() => {
    mockApiFetch.mockReset();
  });

  it("treats forgot-password 202 as accepted even for an unknown email", async () => {
    mockApiFetch.mockResolvedValueOnce({
      success: true,
      data: { accepted: true },
    });

    await expect(
      forgotPasswordApi({ email: "missing@a.com" }),
    ).resolves.toEqual({ accepted: true });

    expect(mockApiFetch).toHaveBeenCalledWith({
      api: "auth",
      url: "forgot-password",
      options: {
        method: "POST",
        body: { email: "missing@a.com" },
      },
    });
  });

  it("does not surface a reset URL from the forgot-password body", async () => {
    mockApiFetch.mockResolvedValueOnce({
      success: true,
      data: {
        accepted: true,
        devResetUrl: "http://localhost:8081/reset-password?token=secret",
      },
    });

    await expect(
      forgotPasswordApi({ email: "known@a.com" }),
    ).resolves.toEqual({ accepted: true });
  });

  it("posts token and newPassword to reset-password", async () => {
    mockApiFetch.mockResolvedValueOnce({ success: true, data: { success: true } });

    await resetPasswordApi({
      token: "tok-1",
      newPassword: "Abcdef1!",
    });

    expect(mockApiFetch).toHaveBeenCalledWith({
      api: "auth",
      url: "reset-password",
      options: {
        method: "POST",
        body: { token: "tok-1", newPassword: "Abcdef1!" },
      },
    });
  });
});
