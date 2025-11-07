import { ENV } from "../config/env.config";
import { HTTPSTATUS } from "../config/http.config";


export const errorMiddleware = (err, req, res, next): any => {
  const error = {
    ...err,
    message: err.message,
    statusCode: err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR,
    stack: err.stack
  };

   
  switch (true) {
    case err.name === 'CastError':
      error.message = 'Resource not found';
      error.statusCode = HTTPSTATUS.NOT_FOUND
      break;

    case err.code === 11000:
      error.message = 'Duplicate field value entered';
      error.statusCode = HTTPSTATUS.BAD_REQUEST;
      break;

    case err.name === 'ValidationError':
      error.fields = Object.values(err.errors).reduce((acc, { path, message }) => {
        acc[path] = message.replace(/Path\s|!|Validation\sfailed:\s?/g, '').trim();
        return acc;
      }, {});
      error.message = 'Validation failed';
      error.statusCode = HTTPSTATUS.BAD_REQUEST;
      break;

    case err.name === 'JsonWebTokenError':
      error.message = 'Invalid token';
      error.statusCode = HTTPSTATUS.UNAUTHOURIZED;
      break;

    case err.name === 'TokenExpiredError':
      error.message = 'Token expired';
      error.statusCode = HTTPSTATUS.UNAUTHOURIZED;
      break;
  }

  // 4. Prepare response
  const response = {
    success: false,
    error: error.message,
    ...(error.fields && { fields: error.fields })
  };

  // 5. Only include stack in development
  if (ENV.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorMiddleware;