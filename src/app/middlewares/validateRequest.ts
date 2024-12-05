import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../utils/catchAsync";

// Middleware to validate request data using Zod schema
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Validate body and cookies against the schema
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    // Proceed to the next middleware
    next();
  });
};

export default validateRequest;
