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

export const updateCredentialSchema = z.object({
  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(100, "Label must be at most 100 characters")
    .optional(),

  siteName: z
    .string()
    .min(2, "Site name must be at least 2 characters")
    .max(100, "Site name must be at most 100 characters")
    .optional(),

  url: z
    .string()
    .url("URL must be a valid link")
    .max(2048, "URL too long")
    .optional()
    .or(z.literal("")), // allow empty string
  // If you want empty string to NOT overwrite, use transform below

  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(150, "Username must be at most 150 characters")
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be at most 128 characters")
    .optional()
    .transform((val) => (val === "" ? undefined : val)), 
  // prevents empty string from overwriting existing password
});
