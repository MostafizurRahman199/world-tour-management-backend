import { Response } from "express";
import { ENV } from "../config/env";


export interface AuthTokenInfo {
    accessToken?: string;
    refreshToken?: string;
}

// Backend: Update setAuthCookies
export const setAuthCookies = (res: Response, tokenInfo: AuthTokenInfo) => {
  const isProduction = ENV.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: true, // 🔥 Always true (even in dev if using https)
    sameSite: "none" as const, // 🔥 Required for cross-site
    path: "/", // 🔥 Ensure path is set
    domain: isProduction ? ".yourdomain.com" : undefined, // 🔥 Set domain in production
  };

  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  }

  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};



export const clearCookie = (res: Response) => {
  const isProduction = ENV.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};