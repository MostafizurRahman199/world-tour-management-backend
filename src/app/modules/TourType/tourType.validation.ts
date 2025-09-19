import { z } from "zod";
import { validateRequest } from "../../../middleware/validateRequest";

// Create Tour Type Validation Schema
const createTourTypeValidationSchema = z.object({
  name: z.string().nonempty("Name is required").trim(),
});

// Update Tour Type Validation Schema
const updateTourTypeValidationSchema = z.object({
  name: z.string().optional(),
});

export const validateCreateTourType = validateRequest(createTourTypeValidationSchema);
export const validateUpdateTourType = validateRequest(updateTourTypeValidationSchema);


