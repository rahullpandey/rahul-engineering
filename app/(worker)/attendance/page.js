import { redirect } from "next/navigation";

export default function AttendanceRoot() {
  redirect("/attendance/check-in");
}
