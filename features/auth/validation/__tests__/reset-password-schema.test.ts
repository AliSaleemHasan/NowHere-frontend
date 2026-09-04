import { passwordSchema } from "../password-schema";
import { resetPasswordSchema } from "../reset-password-schema";

const valid = {
  newPassword: "Abcdef1!",
  confirm: "Abcdef1!",
};

describe("resetPasswordSchema", () => {
  it("reuses passwordSchema for newPassword", () => {
    expect(passwordSchema.safeParse("Abcdef1!").success).toBe(true);

    const tooShort = resetPasswordSchema.safeParse({
      newPassword: "Abc1!x",
      confirm: "Abc1!x",
    });
    expect(tooShort.success).toBe(false);
    if (tooShort.success) return;
    expect(
      tooShort.error.issues.some(
        (issue) =>
          issue.path.includes("newPassword") &&
          issue.message === "auth.password.minLength",
      ),
    ).toBe(true);
  });

  it("accepts a strong password that matches confirm", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a confirm mismatch", () => {
    const result = resetPasswordSchema.safeParse({
      ...valid,
      confirm: "Abcdef2!",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(
      result.error.issues.some(
        (issue) =>
          issue.path.includes("confirm") &&
          issue.message === "auth.reset.errors.mismatch",
      ),
    ).toBe(true);
  });
});
