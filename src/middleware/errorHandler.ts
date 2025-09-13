import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CustomError } from "../app/interfaces/error.types";
import { handleZodError } from "../app/helpers/handleZodError";
import { handleDuplicateKeyError } from "../app/helpers/handleDuplicateKeyError";
import { handleMongooseValidationError } from "../app/helpers/handleMongooseValidationError";
import { handleCastError } from "../app/helpers/handleCastError";
import { handleJwtError } from "../app/helpers/handleJwtError";

const MONGO_ERROR_CODES = {
  DUPLICATE_KEY: 11000,
};

/* -------------------- Main Middleware -------------------- */
export const errorHandler = (
  err: CustomError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = (err as CustomError).statusCode || 500;
  let status =
    (err as CustomError).status || (statusCode >= 500 ? "error" : "fail");
  let message = (err as CustomError).message || "Something went wrong!";
  let details: any[] | undefined;

  // Delegate to helper functions
  if (err instanceof ZodError) {
    ({ statusCode, status, message, details } = handleZodError(err));
  } else if ((err as CustomError).code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
    ({ statusCode, status, message, details } = handleDuplicateKeyError(
      err as CustomError
    ));
  } else if ((err as CustomError).name === "ValidationError") {
    ({ statusCode, status, message, details } = handleMongooseValidationError(
      err as CustomError
    ));
  } else if ((err as CustomError).name === "CastError") {
    ({ statusCode, status, message } = handleCastError(err as CustomError));
  } else if (
    (err as CustomError).name === "JsonWebTokenError" ||
    (err as CustomError).name === "TokenExpiredError"
  ) {
    ({ statusCode, status, message } = handleJwtError(err as CustomError));
  }

  // Always log error internally
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR 💥", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Build response payload
  const responsePayload: Record<string, any> = { status, message };
  if (details) responsePayload.details = details;

  // Show stack only in development
  if (process.env.NODE_ENV === "development" && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
