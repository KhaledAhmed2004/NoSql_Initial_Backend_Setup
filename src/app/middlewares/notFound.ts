import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

// Handles 404 errors when no route matches
const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false, // Request failed
    message: "API Not Found !!", // Route does not exist
    error: "", // No additional details
  });
};

export default notFound;
