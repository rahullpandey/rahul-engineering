import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { verifyWorkerSessionToken } from "../../../../lib/worker-auth";

export const runtime = "nodejs";

export async function GET(request) {
  const token = request.cookies.get("re_worker")?.value;
  const secret = process.env.SESSION_SECRET || "";
  const session = verifyWorkerSessionToken(token, secret);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const employee = await prisma.employee.findUnique({
    where: { id: session.id },
    select: { id: true, name: true, phone: true }
  });

  if (!employee) {
    return new Response("Not found", { status: 404 });
  }

  return NextResponse.json({ employee });
}
