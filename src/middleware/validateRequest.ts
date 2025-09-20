// src/middleware/validateRequest.ts  

import { z } from "zod";
import { NextFunction, Request, Response } from "express";


export const validateRequest = (schema: z.ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
       
      let bodyData: any;

      if (req.body?.data) {
        bodyData = JSON.parse(req.body.data);
      } else {
        bodyData = req.body;
      }

      const validatedData = schema.parse(bodyData);
      req.body = validatedData;
      next();
    } catch (error) {
      next(error); // 👈 Forward error to global errorHandler
    }
  };
};