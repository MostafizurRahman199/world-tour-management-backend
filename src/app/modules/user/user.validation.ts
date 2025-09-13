//src/app/modules/user/user.validation.ts

import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { Role, IsActive } from "./user.interface";
import { validateRequest } from "../../../middleware/validateRequest";



//__________User Registration Zod Schema

export const registerUserZodSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(
      /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must contain at least one special character"
    ),
  
  role: z.nativeEnum(Role).default(Role.USER).optional(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  
  picture: z.string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(200, "Address cannot exceed 200 characters")
    .optional()
    .or(z.literal('')),
}).strict();




//_______Update User Schema (all fields optional, password has different validation)

export const updateUserZodSchema = z.object({

  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters")
    .optional(),
  
//   email: z.string()
//     .email("Invalid email format")
//     .optional(),
  
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password cannot exceed 50 characters")
    .regex(
      /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      "Password must contain at least one special character"
    )
    .optional()
    .or(z.literal('')),
  
  role: z.nativeEnum(Role).optional(),
  
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  
  picture: z.string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(200, "Address cannot exceed 200 characters")
    .optional()
    .or(z.literal('')),
  
  isDeleted: z.boolean().optional(),
  isActive: z.nativeEnum(IsActive).optional(),
  isVerified: z.boolean().optional(),
}).strict().partial(); // Make all fields optional



//______Types for validation

export type RegisterUserInput = z.infer<typeof registerUserZodSchema>;
export type UpdateUserInput = z.infer<typeof updateUserZodSchema>;




//_____________General validation wrapper function

// export const validateRequest = (schema: z.ZodSchema<any>) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Validate request data using the provided schema
//       const validatedData = schema.parse(req.body);
      
//       // Replace req.body with validated data
//       req.body = validatedData;
      
//       next();
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const errorMessages = error.issues.map((issue) => ({
//           field: issue.path.join('.'),
//           message: issue.message,
//         }));
        
//         res.status(400).json({
//           success: false,
//           error: "Invalid request data",
//           details: errorMessages,
//         });
//       } else {
//         res.status(500).json({
//           success: false,
//           error: "Internal server error",
//         });
//       }
//     }
//   };
// };





//_______Specific validation middleware using the general wrapper

export const validateRegisterUser = validateRequest(registerUserZodSchema);
export const validateUpdateUser = validateRequest(updateUserZodSchema);