import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors.js";
import { verifyAccessToken } from "../lib/jwt.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = header.slice(7).trim();
  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.userId, email: decoded.email };
    return next();
  } catch {
    return next(new AppError("Unauthorized", 401));
  }
}
