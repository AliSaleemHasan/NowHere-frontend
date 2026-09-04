import { passwordSchema } from "../password-schema";

describe("passwordSchema", () => {
  it("rejects a 6-character password", () => {
    const result = passwordSchema.safeParse("Abc1!x");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues.map((issue) => issue.message)).toContain(
      "auth.password.minLength",
    );
  });

  it("rejects passwords missing complexity", () => {
    expect(passwordSchema.safeParse("abcdefgh").success).toBe(false);
    expect(passwordSchema.safeParse("ABCDEFGH").success).toBe(false);
    expect(passwordSchema.safeParse("Abcdefgh").success).toBe(false);
    expect(passwordSchema.safeParse("Abcdefg1").success).toBe(false);
    expect(passwordSchema.safeParse("Abcdefg!").success).toBe(false);
  });

  it("accepts an 8+ mixed password", () => {
    expect(passwordSchema.safeParse("Abcdef1!").success).toBe(true);
    expect(passwordSchema.safeParse("Password123!").success).toBe(true);
  });
});
