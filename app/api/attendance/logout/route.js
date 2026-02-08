import { NextResponse } from "next/server";
import { getWorkerSessionCookieOptions } from "../../../../lib/worker-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    ...getWorkerSessionCookieOptions(0),
    value: "",
    expires: new Date(0)
  });
  return response;
}
