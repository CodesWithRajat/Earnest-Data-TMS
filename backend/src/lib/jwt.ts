import jwt from "jsonwebtoken";

type AccessPayload = {
  userId: string;
  email: string;
};

type RefreshPayload = {
  userId: string;
};

const accessSecret = process.env.JWT_ACCESS_SECRET || "access-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "refresh-secret";

export function signAccessToken(payload: AccessPayload) {
  return jwt.sign(payload, accessSecret, { expiresIn: "15m" });
}

export function signRefreshToken(payload: RefreshPayload) {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, accessSecret) as AccessPayload & jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshSecret) as RefreshPayload & jwt.JwtPayload;
}
