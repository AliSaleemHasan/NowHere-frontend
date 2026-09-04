import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.newPassword === data.confirm, {
    message: "auth.reset.errors.mismatch",
    path: ["confirm"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
