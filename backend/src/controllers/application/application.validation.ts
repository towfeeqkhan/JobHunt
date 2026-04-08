import { z } from "zod";

export const createApplicationSchema = z.object({
  jobDescriptionRaw: z.string().min(1, "Job description cannot be empty"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  company: z.string().trim().min(1, "Company is required"),
  location: z.string().trim().optional(),
  salaryRange: z.string().trim().optional(),
  jobDescriptionSummary: z.string().optional(),
  resumeBulletSuggestions: z.array(z.string()).optional(),
  status: z
    .enum(["Applied", "Phone Screen", "Interview", "Offer", "Rejected"])
    .optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();
