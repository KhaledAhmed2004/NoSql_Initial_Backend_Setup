import { ZodError, ZodIssue } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

// Handles Zod validation errors
const handleZodError = (error: ZodError): TGenericErrorResponse => {
  // Maps Zod issues to a simplified error structure
  const errorSources: TErrorSources = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1], // last index of issue
      message: issue?.message, // Error message
    };
  });

  const statusCode = 400; // Bad request status code

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleZodError;
