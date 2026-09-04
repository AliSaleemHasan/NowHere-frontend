import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("auth.forgot.errors.email"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
