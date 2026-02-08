import { cookies } from "next/headers";
import prisma from "../../../../lib/prisma";
import { verifyWorkerSessionToken } from "../../../../lib/worker-auth";
import CheckInClient from "./check-in-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AttendanceCheckIn() {
  const token = cookies().get("re_worker")?.value;
  const secret = process.env.SESSION_SECRET || "";
  const session = verifyWorkerSessionToken(token, secret);

  if (!session) {
    return null;
  }

  const [employee, hotels] = await Promise.all([
    prisma.employee.findUnique({
      where: { id: session.id },
      select: { id: true, name: true, phone: true }
    }),
    prisma.hotel.findMany({
      select: { id: true, name: true, address: true },
      orderBy: { name: "asc" }
    })
  ]);

  if (!employee) {
    return (
      <div className="attendance-shell">
        <div className="attendance-card card">
          <div className="attendance-title">Access not found</div>
          <p className="attendance-subtitle">
            Your phone number is not registered. Please contact the admin.
          </p>
        </div>
      </div>
    );
  }

  return <CheckInClient employee={employee} hotels={hotels} />;
}
