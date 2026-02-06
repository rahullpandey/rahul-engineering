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
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_QUOTATIONS_BUCKET || "quotations";
  let storedQuotations = [];
  let storageError = null;

  if (!supabaseUrl || !serviceKey) {
    storageError = "Supabase storage is not configured.";
  } else {
    const listResponse = await fetch(`${supabaseUrl}/storage/v1/object/list/${bucket}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prefix: "",
        limit: 50,
        sortBy: { column: "created_at", order: "desc" }
      }),
      cache: "no-store"
    });

    if (!listResponse.ok) {
      storageError = `Storage error: ${listResponse.statusText}`;
    } else {
      const data = await listResponse.json();
      storedQuotations = (data || []).filter((item) => item.name && !item.name.endsWith("/"));
    }
  }

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

      <div className="admin-toolbar" id="quotations">
        <div>
          <h2 className="section-title" style={{ marginBottom: "0.2rem" }}>
            Quotations
          </h2>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Upload finalized quotations to keep them organized in the portal.
          </p>
        </div>
        <div className="admin-toolbar-actions">
          <div className="admin-action-row">
            <a className="button ghost" href="/templates/letter-head.docx" download>
              Download Word Letterhead
            </a>
            <a className="button ghost" href="/templates/letter-head.xlsx" download>
              Download Excel Letterhead
            </a>
          </div>
          <form
            className="admin-upload"
            action="/api/quotations"
            method="post"
            encType="multipart/form-data"
          >
            <input type="file" name="file" required />
            <button className="button primary" type="submit">
              Upload quotation
            </button>
          </form>
        </div>
      </div>

      <h2 className="section-title">Stored Quotations</h2>
      <table className="table" style={{ marginBottom: "2.5rem" }}>
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
            <th>Updated</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {storageError ? (
            <tr>
              <td colSpan={4}>{storageError}</td>
            </tr>
          ) : storedQuotations.length === 0 ? (
            <tr>
              <td colSpan={4}>No quotations uploaded yet.</td>
            </tr>
          ) : (
            storedQuotations.map((file) => (
              <tr key={file.name}>
                <td>{file.name}</td>
                <td>{file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : "-"}</td>
                <td>{file.updated_at || file.created_at ? new Date(file.updated_at || file.created_at).toISOString().slice(0, 10) : "-"}</td>
                <td>
                  <a
                    className="button ghost"
                    href={`/api/quotations?file=${encodeURIComponent(file.name)}`}
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
