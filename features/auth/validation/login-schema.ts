import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("auth.login.errors.email"),
  password: z.string().min(1, "auth.login.errors.passwordRequired"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
