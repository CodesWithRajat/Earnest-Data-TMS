import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { comparePassword, hashPassword, compareToken } from "../lib/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import { sendAuthCookies, clearAuthCookies } from "../lib/http.js";
import { AppError } from "../utils/errors.js";
import { loginSchema, registerSchema } from "../validators/auth.js";

function publicUser(user: { id: string; email: string }) {
  return { id: user.id, email: user.email };
}

async function issueTokens(userId: string, email: string) {
  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId });
  const refreshTokenHash = await hashPassword(refreshToken);
  await prisma.user.update({
    where: { id: userId },
    data: { refreshTokenHash }
  });
  return { accessToken, refreshToken };
}

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message || "Invalid input", 400);
  }

  const { email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError("Email already in use", 409);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password)
    },
    select: { id: true, email: true }
  });

  const { accessToken, refreshToken } = await issueTokens(user.id, user.email);
  sendAuthCookies(res, refreshToken);

  res.status(201).json({
    user: publicUser(user),
    accessToken
  });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message || "Invalid input", 400);
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401);

  const { accessToken, refreshToken } = await issueTokens(user.id, user.email);
  sendAuthCookies(res, refreshToken);

  res.json({
    user: publicUser(user),
    accessToken
  });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("Unauthorized", 401);

  let decoded: { userId: string };
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw new AppError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user || !user.refreshTokenHash) throw new AppError("Unauthorized", 401);

  const matches = await compareToken(token, user.refreshTokenHash);
  if (!matches) throw new AppError("Unauthorized", 401);

  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  res.json({
    accessToken,
    user: publicUser(user)
  });
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { refreshTokenHash: null }
      });
    } catch {
      // ignore invalid token on logout
    }
  }

  clearAuthCookies(res);
  res.json({ message: "Logged out successfully" });
}

export async function me(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true }
  });
  if (!user) throw new AppError("Unauthorized", 401);

  res.json({ user });
}
