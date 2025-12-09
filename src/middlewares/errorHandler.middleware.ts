import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ENV } from "../config/env.config";
import { HTTPSTATUS } from "../config/http.config";

// Custom Error interface
interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, any>;
  fields?: Record<string, string>;
  keyValue?: Record<string, any>; // for Mongoose duplicate key
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let fields: Record<string, string> | undefined;

  // ZOD VALIDATION ERROR
  if (err instanceof ZodError) {
    statusCode = HTTPSTATUS.BAD_REQUEST;
    message = "Validation failed";

    fields = err.issues.reduce((acc: Record<string, string>, issue) => {
      const field = issue.path[0] as string;
      acc[field] = issue.message;
      return acc;
    }, {});
  }

  // MONGOOSE CAST ERROR
  else if (err.name === "CastError") {
    statusCode = HTTPSTATUS.NOT_FOUND;
    message = "Resource not found";
  }

  // MONGOOSE DUPLICATE KEY
  else if (err.code === 11000 && err.keyValue) {
    statusCode = HTTPSTATUS.BAD_REQUEST;
    message = "Duplicate field value entered";

    fields = Object.entries(err.keyValue).reduce(
      (acc: Record<string, string>, [key, value]) => {
        acc[key] = `${value} already exists`;
        return acc;
      },
      {}
    );
  }

  // MONGOOSE VALIDATION ERROR
  else if (err.name === "ValidationError") {
    statusCode = HTTPSTATUS.BAD_REQUEST;
    message = "Validation failed";

    fields = Object.values(err.errors || {}).reduce(
      (acc: Record<string, string>, { path, message }: any) => {
        acc[path] = message;
        return acc;
      },
      {}
    );
  }

  // JWT ERRORS
  else if (err.name === "JsonWebTokenError") {
    statusCode = HTTPSTATUS.UNAUTHOURIZED;
    message = "Invalid token";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = HTTPSTATUS.UNAUTHOURIZED;
    message = "Token expired";
  }

  // RESPONSE
  const response: Record<string, any> = {
    success: false,
    message,
  };

  if (fields) response.fields = fields;

  if (ENV.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
