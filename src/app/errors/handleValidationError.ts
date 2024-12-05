import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// Handles Mongoose ValidationError, which occurs when data validation fails
const handleValidationError = (
  error: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  // Map through validation errors to extract path and message
  const errorSources: TErrorSources = Object.values(error.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path, // Error field path
        message: val?.message, // Error message
      };
    }
  );

  const statusCode = 400; // Bad request status code for validation errors

  return {
    statusCode,
    message: "Validation Error",
    errorSources, // Return the validation error details
  };
};

export default handleValidationError;
