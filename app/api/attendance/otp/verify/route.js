import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { createWorkerSessionToken, getWorkerSessionCookieOptions } from "../../../../../lib/worker-auth";

export const runtime = "nodejs";

function normalizePhone(input) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const phone = normalizePhone(body.phone);
  const otp = (body.otp || "").toString().trim();
  const requestId = (body.requestId || "").toString().trim();

  if (!phone || !otp) {
    return new Response("Phone and OTP are required.", { status: 400 });
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const verifyUrlBase =
    process.env.MSG91_VERIFY_URL || "https://control.msg91.com/api/v5/otp/verify";

  if (!authKey) {
    return new Response("MSG91 is not configured.", { status: 500 });
  }

  const params = new URLSearchParams({ authkey: authKey });
  let verifyUrl = "";

  if (requestId) {
    params.set("otp", otp);
    verifyUrl = `${verifyUrlBase}/${encodeURIComponent(requestId)}?${params.toString()}`;
  } else {
    params.set("mobile", phone);
    params.set("otp", otp);
    verifyUrl = `${verifyUrlBase}?${params.toString()}`;
  }

  const response = await fetch(verifyUrl, { method: "GET", headers: { Accept: "application/json" } });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return new Response(data?.message || "OTP verification failed.", { status: 401 });
  }

  const localPhone = phone.slice(-10);
  const employee = await prisma.employee.findFirst({
    where: {
      OR: [{ phone: localPhone }, { phone }]
    }
  });

  if (!employee) {
    return new Response("Phone number not registered. Contact admin.", { status: 404 });
  }

  const secret = process.env.SESSION_SECRET || "";
  if (!secret) {
    return new Response("Session secret is missing.", { status: 500 });
  }

  const { token, exp } = createWorkerSessionToken(employee.id, secret);
  const responsePayload = NextResponse.json({
    success: true,
    employee: { id: employee.id, name: employee.name, phone: employee.phone }
  });

  responsePayload.cookies.set({
    ...getWorkerSessionCookieOptions(exp),
    value: token
  });

  return responsePayload;
}
