import { z } from "zod";
import { passwordSchema } from "./password-schema";

export const signupSchema = z
  .object({
    email: z.email("auth.signup.errors.email"),
    password: passwordSchema,
    firstName: z.string().min(1, "auth.signup.errors.firstName"),
    lastName: z.string().min(1, "auth.signup.errors.lastName"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "auth.signup.errors.passwordMismatch",
    path: ["confirm"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
