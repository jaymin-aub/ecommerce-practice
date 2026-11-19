import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/errors.ts";

export type AuthPayload = {
  id: number;
  email: string;
  username: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Authorization header missing");
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    throw new UnauthorizedError("Token missing or malformed");
  }

  const secretKey = process.env.JWT_SECRET!;

  // Verifies token (JsonWebTokenError & TokenExpiredError are handled by global errorHandler)
  const decoded = jwt.verify(token, secretKey);

  // Store authenticated user in Express built-in res.locals
  res.locals.user = decoded;

  next();
};

export default authMiddleware;
