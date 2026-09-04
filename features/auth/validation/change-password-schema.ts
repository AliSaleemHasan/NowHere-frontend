import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "users.password.errors.currentRequired"),
    newPassword: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "users.password.errors.mismatch",
    path: ["confirm"],
  });

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
