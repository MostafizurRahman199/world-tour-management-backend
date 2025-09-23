// src/app/utils/parseFormDataJSON.ts
import { Request, Response, NextFunction } from "express";

export const parseFormDataJSON = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.data) {
    try {
      const parsed = JSON.parse(req.body.data);
      req.body = { ...parsed }; // overwrite req.body with parsed object
    } catch (err) {
      return res.status(400).json({ status: "fail", message: "Invalid JSON in 'data'" });
    }
  }
  next();
};
