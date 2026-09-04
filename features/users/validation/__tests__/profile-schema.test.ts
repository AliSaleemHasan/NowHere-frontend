import { updateProfileSchema } from "../profile-schema";

describe("updateProfileSchema", () => {
  it("trims bio so whitespace-only becomes empty", () => {
    const result = updateProfileSchema.safeParse({
      firstName: " Ada ",
      lastName: " Lovelace ",
      bio: "   ",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      firstName: "Ada",
      lastName: "Lovelace",
      bio: "",
    });
  });
});
