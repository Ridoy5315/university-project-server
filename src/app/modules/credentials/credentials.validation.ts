import { z } from "zod";

export const createCredentialSchema = z.object({
  email: z.string().email("Invalid email"), 

  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(100, "Label must be at most 100 characters"),

  siteName: z
    .string()
    .min(2, "Site name must be at least 2 characters")
    .max(100, "Site name must be at most 100 characters"),

  url: z
    .string()
    .url("URL must be a valid link")
    .max(2048, "URL too long")
    .optional()
    .or(z.literal("")),

  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(150, "Username must be at most 150 characters"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters"),
});
