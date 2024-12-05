import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    // Extends the Express Request interface to include a 'user' property of type JwtPayload
    interface Request {
      user: JwtPayload;
    }
  }
}
