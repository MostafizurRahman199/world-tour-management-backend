// src/app/modules/tour/tour.validation.ts

import { z } from "zod";
import { validateRequest } from "../../../middleware/validateRequest";



// Create Tour Validation Schema
const createTourValidationSchema = z.object({
  title: z.string().nonempty("Title is required").trim(),
  slug: z.string().optional(),
  description: z.string().optional(),
  arrivalLocation: z.string().optional(),
  departureLocation: z.string().optional(),
  images: z.array(z.string()).default([]).optional(),
  location: z.string().optional(),
  costFrom: z.number().min(0, "Cost must be a positive number").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).default([]).optional(),
  amenities: z.array(z.string()).default([]).optional(),
  tourPlan: z.array(z.string()).default([]).optional(),
  maxGuest: z.number().min(1, "Max guests must be at least 1").optional(),
  minAge: z.number().min(0, "Min age must be a non-negative number").optional(),
  division: z.string().nonempty("Division ID is required"),
  tourType: z.string().nonempty("Tour type ID is required"),
});



// Update Tour Validation Schema
const updateTourValidationSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).default([]).optional(),
  arrivalLocation: z.string().optional(),
  departureLocation: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().min(0, "Cost must be a positive number").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).default([]).optional(),
  amenities: z.array(z.string()).default([]).optional(),
  tourPlan: z.array(z.string()).default([]).optional(),
  maxGuest: z.number().min(1, "Max guests must be at least 1").optional(),
  minAge: z.number().min(0, "Min age must be a non-negative number").optional(),
  division: z.string().optional(),
  tourType: z.string().optional(),


   // New fields for image handling
  newImages: z.array(z.string().url()).optional(),
  imagesToDelete: z.array(z.string().url()).optional(),
  clearImages: z.boolean().optional(),
}).partial();

export const validateCreateTour = validateRequest(createTourValidationSchema);
export const validateUpdateTour = validateRequest(updateTourValidationSchema);
