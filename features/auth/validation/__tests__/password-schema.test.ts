import { passwordSchema } from "../password-schema";

describe("passwordSchema", () => {
  it("rejects a 6-character password", () => {
    expect(passwordSchema.safeParse("Abc1!x").success).toBe(false);
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
