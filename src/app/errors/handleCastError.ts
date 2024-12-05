import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// Function to handle MongoDB CastError (invalid ID)
const handleCastError = (
  error: mongoose.Error.CastError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    { path: error.path, message: error.message }, // Provide error path and message
  ];
  const statusCode = 400; // Bad request status code for invalid ID
  return {
    statusCode,
    message: "Invalid ID",
    errorSources, // Return the error source details
  };
};
export default handleCastError;
