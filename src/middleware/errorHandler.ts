import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CustomError } from "../app/interfaces/error.types";
import { handleZodError } from "../app/helpers/handleZodError";
import { handleDuplicateKeyError } from "../app/helpers/handleDuplicateKeyError";
import { handleMongooseValidationError } from "../app/helpers/handleMongooseValidationError";
import { handleCastError } from "../app/helpers/handleCastError";
import { handleJwtError } from "../app/helpers/handleJwtError";
import { deleteImageFromCLoudinary } from "../app/config/cloudinary.config";

const MONGO_ERROR_CODES = {
  DUPLICATE_KEY: 11000,
};


//global error handler

export const errorHandler = async(
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


  //cloudinary image delete
  // 🗑️ If there are uploaded files, clean them up

  try {
    const uploadedFiles: string[] = [];

    if (req.file && (req.file as any).path) {
      uploadedFiles.push((req.file as any).path);
    }
    if (req.files && Array.isArray(req.files)) {
      uploadedFiles.push(...(req.files as any[]).map((f) => f.path));
    }

    if (uploadedFiles.length) {
      await Promise.all(uploadedFiles.map((url) => deleteImageFromCLoudinary(url)));
    }
  } catch (cleanupErr) {
    console.error("Cloudinary cleanup failed ❌", cleanupErr);
  }


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

  if (process.env.NODE_ENV === "development" && err.stack) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};
