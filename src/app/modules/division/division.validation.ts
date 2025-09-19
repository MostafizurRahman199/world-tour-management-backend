import { z } from "zod";
import { validateRequest } from "../../../middleware/validateRequest";

// Create Division Schema
const createDivisionZodSchema = z.object({
  name: z.string()
    .min(1, "Division name is required")
    .max(100, "Division name cannot exceed 100 characters"),

  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters").optional(),

  thumbnail: z.string()
    .url("Thumbnail must be a valid URL")
    .optional()
    .or(z.literal('')),

  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal('')),
}).strict();


// Update Division Schema (all fields optional)
const updateDivisionZodSchema = z.object({
  name: z.string()
    .min(1, "Division name is required")
    .max(100, "Division name cannot exceed 100 characters")
    .optional(),

  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .optional(),

  thumbnail: z.string()
    .url("Thumbnail must be a valid URL")
    .optional()
    .or(z.literal('')),

  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .or(z.literal('')),
}).strict().partial();

export const validateUpdateDivision = validateRequest(updateDivisionZodSchema);


export const validateCreateDivision = validateRequest(createDivisionZodSchema);
