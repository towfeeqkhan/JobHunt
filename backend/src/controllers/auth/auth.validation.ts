import { z } from "zod";

const emailSchema = z.email().toLowerCase().trim();

const strongPasswordSchema = z
  .string()
  .trim()
  .min(8, { error: "Password must be at least 8 characters" })
  .max(100, { error: "Password must be at most 100 characters" })
  .regex(/[A-Z]/, { error: "Must include at least one uppercase letter" })
  .regex(/[a-z]/, { error: "Must include at least one lowercase letter" })
  .regex(/[0-9]/, { error: "Must include at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    error: "Must include at least one special character",
  });

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { error: "Name must be at least 3 characters" })
    .max(50, { error: "Name must be at most 50 characters" }),
  email: emailSchema,
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(8, { error: "Password must be at least 8 characters" }),
});
