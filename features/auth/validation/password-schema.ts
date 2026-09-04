import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "auth.password.minLength")
  .regex(/[a-z]/, "auth.password.lowercase")
  .regex(/[A-Z]/, "auth.password.uppercase")
  .regex(/\d/, "auth.password.number")
  .regex(/[^A-Za-z0-9]/, "auth.password.symbol");
