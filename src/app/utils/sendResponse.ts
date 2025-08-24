// utils/sendResponse.ts
import { Response } from "express";

interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export const sendResponse = <T>(res: Response, payload: IApiResponse<T>) => {
  return res.status(payload.statusCode).json(payload);
};
