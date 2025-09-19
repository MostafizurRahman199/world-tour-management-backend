import { Error as MongooseError } from "mongoose";

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number | string;
  keyValue?: Record<string, any>;
  path?: string;
  value?: any;
  errors?: Record<
    string,
    MongooseError.ValidatorError | MongooseError.CastError
  >;
}