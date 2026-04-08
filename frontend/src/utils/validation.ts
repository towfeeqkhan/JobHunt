import { z } from "zod";

const emailSchema = z.email("Invalid email").toLowerCase().trim();

const strongPasswordSchema = z
  .string()
  .trim()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(100, { message: "Password must be at most 100 characters" })
  .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
  .regex(/[a-z]/, { message: "Must include at least one lowercase letter" })
  .regex(/[0-9]/, { message: "Must include at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Must include at least one special character",
  });

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  email: emailSchema,
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const addJobSchema = z.object({
  jobDescriptionRaw: z
    .string()
    .min(1, { message: "Job description cannot be empty" }),
  jobTitle: z.string().trim().min(1, { message: "Job title is required" }),
  company: z.string().trim().min(1, { message: "Company is required" }),
  location: z.string().trim().optional(),
  salaryRange: z.string().trim().optional(),
});

export type AddJobFormValues = z.infer<typeof addJobSchema>;
