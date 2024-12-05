import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorSources } from "../interface/error";
import config from "../config";
import AppError from "../errors/AppError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";

// Global error handler for catching different types of errors
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Default values for error response
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSource: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle Mongoose validation errors
  else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle MongoDB cast errors (invalid object IDs)
  else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle MongoDB duplicate key errors
  else if (error?.code === 11000) {
    const simplifiedError = handleDuplicateError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource = simplifiedError.errorSources;
  }
  // Handle custom AppError
  else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSource = [
      {
        path: "",
        message: error.message,
      },
    ];
  }
  // Handle general errors
  else if (error instanceof Error) {
    message = error.message;
    errorSource = [
      {
        path: "",
        message: error.message,
      },
    ];
  }

  // Final response with error details
  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    // error,
    stack: config.NODE_ENV === "development" ? error.stack : null,
  });
};

export default globalErrorHandler;
