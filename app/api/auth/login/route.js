import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  verifyPassword,
  SESSION_COOKIE
} from "../../../../lib/auth";

function safeRedirect(pathname) {
  if (typeof pathname !== "string") return "/admin";
  if (!pathname.startsWith("/admin")) return "/admin";
  return pathname;
}

export async function POST(request) {
  const formData = await request.formData();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = safeRedirect(String(formData.get("redirect") || ""));

  const adminUser = process.env.ADMIN_USER || "";
  const passwordSalt = process.env.ADMIN_PASSWORD_SALT || "";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
  const sessionSecret = process.env.SESSION_SECRET || "";

  if (!adminUser || !passwordSalt || !passwordHash || !sessionSecret) {
    return NextResponse.redirect(new URL("/admin/login?error=setup", request.url));
  }

  const isValidUser = username === adminUser;
  const isValidPass = verifyPassword(password, passwordSalt, passwordHash);

  if (!isValidUser || !isValidPass) {
    return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url));
  }

  const { token, exp } = createSessionToken(username, sessionSecret);
  const response = NextResponse.redirect(new URL(redirectTo, request.url));
  response.cookies.set({
    ...getSessionCookieOptions(exp),
    name: SESSION_COOKIE,
    value: token
  });
  return response;
}
