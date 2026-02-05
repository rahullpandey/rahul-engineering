import crypto from "node:crypto";

const SESSION_COOKIE = "re_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(input) {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const final = padded + "=".repeat(padLength);
  return Buffer.from(final, "base64").toString("utf-8");
}

export function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

export function verifyPassword(password, salt, hash) {
  const computed = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

export function createSessionToken(username, secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const payload = base64UrlEncode(JSON.stringify({ u: username, exp }));
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return { token: `${payload}.${signature}`, exp };
}

export function verifySessionToken(token, secret) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  const decoded = JSON.parse(base64UrlDecode(payload));
  if (!decoded?.exp || decoded.exp < Math.floor(Date.now() / 1000)) return null;
  return decoded;
}

export function getSessionCookieOptions(expirationUnix) {
  return {
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expirationUnix * 1000)
  };
}

export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };
