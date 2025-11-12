import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.config";
import { HTTPSTATUS } from "../config/http.config";

// Define a custom Error interface for better typing
interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { path: string; message: string }>;
  fields?: Record<string, string>;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const error: CustomError = {
    ...err,
    message: err.message || "Internal Server Error",
    statusCode: err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR,
    stack: err.stack,
  };

  // Switch on known error types
  switch (true) {
    case err.name === "CastError":
      error.message = "Resource not found";
      error.statusCode = HTTPSTATUS.NOT_FOUND;
      break;

    case err.code === 11000:
      error.message = "Duplicate field value entered";
      error.statusCode = HTTPSTATUS.BAD_REQUEST;
      break;

    case err.name === "ValidationError":
      error.fields = Object.values(err.errors || {}).reduce(
        (acc: Record<string, string>, { path, message }) => {
          acc[path] = message
            .replace(/Path\s|!|Validation\sfailed:\s?/g, "")
            .trim();
          return acc;
        },
        {}
      );
      error.message = "Validation failed";
      error.statusCode = HTTPSTATUS.BAD_REQUEST;
      break;

    case err.name === "JsonWebTokenError":
      error.message = "Invalid token";
      error.statusCode = HTTPSTATUS.UNAUTHOURIZED;
      break;

    case err.name === "TokenExpiredError":
      error.message = "Token expired";
      error.statusCode = HTTPSTATUS.UNAUTHOURIZED;
      break;
  }

  // Prepare response
  const response: Record<string, any> = {
    success: false,
    error: error.message,
    ...(error.fields && { fields: error.fields }),
  };

  // Include stack trace only in development
  if (ENV.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(error.statusCode || 500).json(response);
};
