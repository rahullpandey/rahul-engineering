import prisma from "../../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getTodayInKolkata() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export default async function AttendanceAdmin({ searchParams }) {
  const date = searchParams?.date || getTodayInKolkata();

  const records = await prisma.attendanceRecord.findMany({
    where: { attendanceDate: date },
    include: {
      employee: { select: { name: true, phone: true } },
      hotel: { select: { name: true } }
    },
    orderBy: { capturedAt: "desc" }
  });

  const counts = records.reduce(
    (acc, record) => {
      acc.total += 1;
      if (record.status === "PRESENT") acc.present += 1;
      if (record.status === "ABSENT") acc.absent += 1;
      if (record.status === "HALF_DAY") acc.halfDay += 1;
      return acc;
    },
    { total: 0, present: 0, absent: 0, halfDay: 0 }
  );

  return (
    <div className="admin-page">
      <div className="admin-section">
        <h1>Attendance</h1>
        <p className="muted">Live attendance tracking for workers.</p>
        <form className="admin-filter" method="get">
          <label>
            Date
            <input type="date" name="date" defaultValue={date} />
          </label>
          <button className="button" type="submit">
            Apply
          </button>
        </form>
      </div>

      <div className="card-grid">
        <div className="card">
          <div className="metric-label">Total</div>
          <div className="metric-value">{counts.total}</div>
        </div>
        <div className="card">
          <div className="metric-label">Present</div>
          <div className="metric-value">{counts.present}</div>
        </div>
        <div className="card">
          <div className="metric-label">Absent</div>
          <div className="metric-value">{counts.absent}</div>
        </div>
        <div className="card">
          <div className="metric-label">Half Day</div>
          <div className="metric-value">{counts.halfDay}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Hotel</th>
              <th>Captured</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">No attendance yet.</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id}>
                  <td>{record.employee?.name}</td>
                  <td>{record.employee?.phone}</td>
                  <td>{record.status.replace("_", " ")}</td>
                  <td>{record.hotel?.name || "-"}</td>
                  <td>{record.capturedAt.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
