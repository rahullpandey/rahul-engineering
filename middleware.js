import { NextResponse } from "next/server";

const SESSION_COOKIE = "re_session";
const WORKER_SESSION_COOKIE = "re_worker";

function base64UrlToUint8Array(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLength);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function base64UrlDecode(base64Url) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLength);
  return atob(padded);
}

async function verifySessionToken(token, secret) {
  if (!token || !secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToUint8Array(signature),
    encoder.encode(payload)
  );

  if (!isValid) return null;
  const decoded = JSON.parse(base64UrlDecode(payload));
  if (!decoded?.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;
  return decoded;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/attendance")) {
    if (pathname === "/attendance/login") return NextResponse.next();
    const token = request.cookies.get(WORKER_SESSION_COOKIE)?.value;
    const secret = process.env.SESSION_SECRET || "";
    const session = await verifySessionToken(token, secret);

    if (!session) {
      const loginUrl = new URL("/attendance/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.SESSION_SECRET || "";
  const session = await verifySessionToken(token, secret);

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/attendance/:path*"]
};
