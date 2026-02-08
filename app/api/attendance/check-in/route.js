import { NextResponse } from "next/server";
import crypto from "node:crypto";
import prisma from "../../../../lib/prisma";
import { verifyWorkerSessionToken } from "../../../../lib/worker-auth";

export const runtime = "nodejs";

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_SELFIES_BUCKET || "selfies";

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return { supabaseUrl, serviceKey, bucket };
}

function sanitizeDate(input) {
  return (input || "").toString().replace(/[^0-9-]/g, "");
}

export async function POST(request) {
  const token = request.cookies.get("re_worker")?.value;
  const secret = process.env.SESSION_SECRET || "";
  const session = verifyWorkerSessionToken(token, secret);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const status = (formData.get("status") || "").toString();
  const attendanceDate = sanitizeDate(formData.get("attendanceDate"));
  const hotelId = (formData.get("hotelId") || "").toString() || null;
  const latitude = parseFloat(formData.get("latitude") || "");
  const longitude = parseFloat(formData.get("longitude") || "");
  const selfie = formData.get("selfie");

  if (!status || !attendanceDate) {
    return new Response("Missing attendance data.", { status: 400 });
  }

  if (!selfie || typeof selfie === "string") {
    return new Response("Selfie is required.", { status: 400 });
  }

  const config = getStorageConfig();
  if (!config) {
    return new Response("Supabase storage is not configured.", { status: 500 });
  }

  const arrayBuffer = await selfie.arrayBuffer();
  const contentType = selfie.type || "image/jpeg";
  const extension = (selfie.name || "jpg").split(".").pop() || "jpg";
  const safeDate = attendanceDate || "unknown";
  const fileKey = `${session.id}/${safeDate}/${crypto.randomUUID()}.${extension}`;

  const uploadResponse = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${encodeURIComponent(fileKey)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.serviceKey}`,
        apikey: config.serviceKey,
        "Content-Type": contentType,
        "x-upsert": "false"
      },
      body: Buffer.from(arrayBuffer)
    }
  );

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    return new Response(errorText || "Upload failed", { status: 500 });
  }

  const parsedLat = Number.isFinite(latitude) ? latitude : null;
  const parsedLng = Number.isFinite(longitude) ? longitude : null;

  const record = await prisma.attendanceRecord.upsert({
    where: {
      employeeId_attendanceDate: {
        employeeId: session.id,
        attendanceDate
      }
    },
    update: {
      status,
      hotelId,
      latitude: parsedLat,
      longitude: parsedLng,
      selfiePath: fileKey,
      capturedAt: new Date()
    },
    create: {
      employeeId: session.id,
      hotelId,
      status,
      attendanceDate,
      latitude: parsedLat,
      longitude: parsedLng,
      selfiePath: fileKey
    }
  });

  return NextResponse.json({ success: true, attendance: record });
}
