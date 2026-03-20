import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => bcrypt.hash(password, 10);
export const comparePassword = async (password: string, hash: string) => bcrypt.compare(password, hash);
export const hashToken = async (token: string) => bcrypt.hash(token, 10);
export const compareToken = async (token: string, hash: string) => bcrypt.compare(token, hash);
