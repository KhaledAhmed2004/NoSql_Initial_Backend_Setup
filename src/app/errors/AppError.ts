// Custom error class to handle application errors with a status code
class AppError extends Error {
  public statusCode: number; // HTTP status code for the error

  // Constructor to set the status code, message, and optional stack trace
  constructor(statusCode: number, message: string, stack = "") {
    super(message); // Set the error message
    this.statusCode = statusCode; // Set the status code

    // If stack is provided, use it; otherwise, generate it
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Generate stack trace for debugging
    }
  }
}

export default AppError;
