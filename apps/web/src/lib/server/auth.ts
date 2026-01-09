import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { NextResponse } from "next/server";

export function validateNickname(nickname: string) {
  if (!nickname) return "Informe um nickname.";
  if (nickname.length < 3) return "Nickname muito curto (mínimo 3).";
  if (nickname.length > 24) return "Nickname muito longo (máximo 24).";
  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) return "Use só letras, números e _ (sem espaço).";
  return null;
}

export function validatePassword(password: string) {
  if (!password) return "Informe uma senha.";
  if (password.length < 8) return "Senha muito curta (mínimo 8).";
  if (!/[a-zA-Z]/.test(password)) return "A senha precisa ter pelo menos 1 letra.";
  if (!/[0-9]/.test(password)) return "A senha precisa ter pelo menos 1 número.";
  return null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function newSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * IMPORTANTe: em Route Handlers (app/api/...) use o NextResponse para setar cookie:
 *   const res = NextResponse.json(...)
 *   setSessionCookie(res, token, 30)
 *   return res
 */
export function setSessionCookie(res: NextResponse, token: string, days: number) {
  res.cookies.set({
    name: "dk_session",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: days * 24 * 60 * 60,
  });
}

export function clearSessionCookie(res: NextResponse) {
  res.cookies.set({
    name: "dk_session",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
