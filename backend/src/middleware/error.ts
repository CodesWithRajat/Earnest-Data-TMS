import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError("Route not found", 404));
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    message
  });
}
