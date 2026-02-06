import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [employeeCount, hotelCount, projectCount, projects] = await Promise.all([
    prisma.employee.count(),
    prisma.hotel.count(),
    prisma.project.count(),
    prisma.project.findMany({
      include: { hotel: true },
      orderBy: { updatedAt: "desc" },
      take: 5
    })
  ]);

  const kpis = [
    { label: "Active Employees", value: employeeCount },
    { label: "Hotels Under Contract", value: hotelCount },
    { label: "Projects Live", value: projectCount }
  ];

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Dashboard</h1>
      <p style={{ color: "var(--muted)" }}>Track workforce and hotel projects at a glance.</p>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div className="kpi" key={kpi.label}>
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
          </div>
        ))}
      </div>

      <h2 className="section-title">Quotations</h2>
      <div className="card" style={{ marginBottom: "2.5rem" }}>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          Create a new quotation using the official Rahul Engineering letterhead.
        </p>
        <div className="admin-action-row">
          <a className="button primary" href="/templates/letter-head.docx" download>
            Create in MS Word
          </a>
          <a className="button ghost" href="/templates/letter-head.xlsx" download>
            Create in MS Excel
          </a>
        </div>
      </div>

      <h2 className="section-title">Recent Project Activity</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Project</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((row) => (
            <tr key={row.id}>
              <td>{row.hotel?.name}</td>
              <td>{row.name}</td>
              <td>{row.status}</td>
              <td>{new Date(row.updatedAt).toISOString().slice(0, 10)}</td>
            </tr>
          ))}
          {projects.length === 0 ? (
            <tr>
              <td colSpan={4}>No projects yet. Add your first project to see it here.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </section>
  );
}
