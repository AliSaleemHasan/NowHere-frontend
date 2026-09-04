import { changePasswordSchema } from "../change-password-schema";
import { passwordSchema } from "../password-schema";

const valid = {
  currentPassword: "Oldpass1!",
  newPassword: "Abcdef1!",
  confirm: "Abcdef1!",
};

describe("changePasswordSchema", () => {
  it("uses passwordSchema for newPassword", () => {
    expect(passwordSchema.safeParse("Abcdef1!").success).toBe(true);
    expect(passwordSchema.safeParse("short").success).toBe(false);

    const tooShort = changePasswordSchema.safeParse({
      ...valid,
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

    const missingSymbol = changePasswordSchema.safeParse({
      ...valid,
      newPassword: "Abcdefg1",
      confirm: "Abcdefg1",
    });
    expect(missingSymbol.success).toBe(false);
    if (missingSymbol.success) return;
    expect(
      missingSymbol.error.issues.some(
        (issue) =>
          issue.path.includes("newPassword") &&
          issue.message === "auth.password.symbol",
      ),
    ).toBe(true);
  });

  it("accepts a strong new password that matches confirm", () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty current password without applying strength rules", () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      currentPassword: "",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.map((issue) => issue.message)).toContain(
      "users.password.errors.currentRequired",
    );
    expect(
      result.error.issues.some((issue) =>
        issue.message.startsWith("auth.password."),
      ),
    ).toBe(false);
  });

  it("rejects a confirm mismatch", () => {
    const result = changePasswordSchema.safeParse({
      ...valid,
      confirm: "Abcdef2!",
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(
      result.error.issues.some(
        (issue) =>
          issue.path.includes("confirm") &&
          issue.message === "users.password.errors.mismatch",
      ),
    ).toBe(true);
  });
});
