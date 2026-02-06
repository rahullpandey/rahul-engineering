import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0)
  });
  return response;
}
