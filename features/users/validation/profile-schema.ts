import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1, "users.edit.errors.firstName"),
  lastName: z.string().trim().min(1, "users.edit.errors.lastName"),
  bio: z.string().trim(),
});

export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
