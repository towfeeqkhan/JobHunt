import { CookieOptions } from "express";
import ms from "ms";

export const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: ms("7d"),
    path: "/",
  };
};
