import { Request, Response, NextFunction } from 'express';

// Unified error interface
interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number | string;
  errors?: any[];
  keyValue?: Record<string, any>;
  path?: string;
  value?: any;
}

// Type guard to check error type
function isOperationalError(error: any): error is CustomError {
  return error.isOperational === true && error.statusCode !== undefined;
}

// MongoDB error codes
const MONGO_ERROR_CODES = {
  DUPLICATE_KEY: 11000,
  VALIDATION_FAILED: 'ValidationFailed'
};




export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Handle different error types
  let statusCode = 500;
  let status = 'error';
  let message = err.message;
  let isOperational = false;



  // 1. AppError or custom operational errors
  if (err.statusCode && err.isOperational) {
    statusCode = err.statusCode;
    status = err.status || (statusCode >= 500 ? 'error' : 'fail');
    message = err.message;
    isOperational = true;
  }



  // 2. MongoDB duplicate key error
  else if (err.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
    statusCode = 409;
    status = 'fail';
    message = 'Duplicate field value entered';
    isOperational = true;
    
    // Extract field name from error
    const field = Object.keys(err.keyValue || {})[0];
    if (field) {
      message = `${field} already exists`;
    }
  }



  // 3. MongoDB validation error
  else if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    status = 'fail';
    message = 'Validation failed';
    isOperational = true;
    
    // Extract validation errors
    const errors = Object.values(err.errors).map((e: any) => e.message);
    if (errors.length > 0) {
      message = errors.join(', ');
    }
  }



  // 4. MongoDB CastError (invalid ID)
  else if (err.name === 'CastError') {
    statusCode = 400;
    status = 'fail';
    message = `Invalid ${err.path}: ${err.value}`;
    isOperational = true;
  }



  // 5. JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    status = 'fail';
    message = 'Invalid token';
    isOperational = true;
  }


  // 6. JWT expired error
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    status = 'fail';
    message = 'Token expired';
    isOperational = true;
  }



  // 7. Default operational errors (like thrown Error with statusCode)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    status = err.status || (statusCode >= 500 ? 'error' : 'fail');
    message = err.message;
    isOperational = true;
  }


  // 8. Programming or unknown errors
  else {
    statusCode = 500;
    status = 'error';
    message = 'Something went wrong!';
    isOperational = false;
  }


  // Log error with details
  console.error('ERROR 💥', {
    statusCode,
    status,
    message: err.message,
    name: err.name,
    code: err.code,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    isOperational
  });



  // Production vs development response
  if (process.env.NODE_ENV === 'production') {
    if (isOperational) {
      return res.status(statusCode).json({
        status,
        message
      });
    }

    // Programming errors - don't leak details
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }


  
  // Development - send detailed error
  res.status(statusCode).json({
    status,
    error: {
      name: err.name,
      message: err.message,
      statusCode,
      isOperational,
      ...(err.code && { code: err.code }),
      ...(err.stack && { stack: err.stack })
    },
    message,
    ...(err.stack && { stack: err.stack })
  });
};