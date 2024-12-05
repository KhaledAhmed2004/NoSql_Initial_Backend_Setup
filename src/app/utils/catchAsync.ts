import { NextFunction, Request, RequestHandler, Response } from "express";

// Wrapper to handle async errors in route handlers
const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Catches errors and passes them to next middleware
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  };
};

export default catchAsync;
