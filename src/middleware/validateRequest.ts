// src/middleware/validateRequest.ts  

import { z } from "zod";
import { NextFunction, Request, Response } from "express";





export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error); // 👈 Forward error to global errorHandler
    }
  };
};