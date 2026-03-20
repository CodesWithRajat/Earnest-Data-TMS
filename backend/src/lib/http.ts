import type { Response } from "express";

export function sendAuthCookies(res: Response, refreshToken: string) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("refreshToken", {
    path: "/"
  });
}
