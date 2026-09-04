import { loginSchema } from "../login-schema";

describe("loginSchema", () => {
  it("requires a non-empty password without strength rules", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.co", password: "x" }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({ email: "a@b.co", password: "Abcdef1!" }).success,
    ).toBe(true);

    const empty = loginSchema.safeParse({ email: "a@b.co", password: "" });
    expect(empty.success).toBe(false);
    if (empty.success) return;
    expect(empty.error.issues.map((issue) => issue.message)).toContain(
      "auth.login.errors.passwordRequired",
    );
    expect(
      empty.error.issues.some((issue) =>
        issue.message.startsWith("auth.password."),
      ),
    ).toBe(false);
  });
});
