import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors.ts";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Global Error Caught:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    // Handle specific Mongoose error types if thrown
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = err.message;
    } else if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID or data format";
    } else if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    } else if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    } else {
      message = err.message;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(statusCode === 500 && {
      error: err instanceof Error ? err.message : "Unknown error",
    }),
  });
};
