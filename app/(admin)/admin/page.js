import prisma from "../../../lib/prisma";
import PurgeForm from "./components/PurgeForm";
import RecycleForm from "./components/RecycleForm";

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

  let activeQuotations = [];
  let recycledQuotations = [];

  if (!supabaseUrl || !serviceKey) {
    storageError = "Supabase storage is not configured.";
  } else {
    const listFiles = async (prefix) => {
      const response = await fetch(`${supabaseUrl}/storage/v1/object/list/${bucket}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prefix,
          limit: 100,
          sortBy: { column: "created_at", order: "desc" }
        }),
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      const cleaned = (data || [])
        .filter((item) => item.name && !item.name.endsWith("/"))
        .map((item) => {
          if (!prefix) return item;
          const normalized = item.name.startsWith(`${prefix}/`)
            ? item.name
            : `${prefix}/${item.name}`;
          return { ...item, name: normalized };
        });
      return prefix ? cleaned : cleaned.filter((item) => !item.name.startsWith("recycle/"));
    };

    try {
      activeQuotations = await listFiles("");
      recycledQuotations = await listFiles("recycle");
    } catch (error) {
      storageError = `Storage error: ${error.message}`;
    }
  }

  const kpis = [
    { label: "Active Employees", value: employeeCount },
    { label: "Hotels Under Contract", value: hotelCount },
    { label: "Projects Live", value: projectCount }
  ];

  return (
    <section className="admin-dashboard">
      <div className="admin-hero">
        <div className="admin-hero-content">
          <span className="admin-hero-eyebrow">Admin Control Center</span>
          <h1>Dashboard</h1>
          <p>Track workforce, hotels, and projects with real-time clarity.</p>
          <div className="admin-hero-chips">
            <span>Operational Snapshot</span>
            <span>Secure Admin Portal</span>
          </div>
        </div>
        <div className="admin-hero-orb" aria-hidden />
      </div>

      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <div className="kpi admin-kpi" key={kpi.label}>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {storageError ? (
            <tr>
              <td colSpan={5}>{storageError}</td>
            </tr>
          ) : activeQuotations.length === 0 ? (
            <tr>
              <td colSpan={5}>No quotations uploaded yet.</td>
            </tr>
          ) : (
            activeQuotations.map((file) => (
              <tr key={file.name}>
                <td data-label="File">{file.name}</td>
                <td data-label="Size">{file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : "-"}</td>
                <td data-label="Updated">{file.updated_at || file.created_at ? new Date(file.updated_at || file.created_at).toISOString().slice(0, 10) : "-"}</td>
                <td data-label="Download">
                  <a
                    className="button ghost"
                    href={`/api/quotations?file=${encodeURIComponent(file.name)}`}
                  >
                    Download
                  </a>
                </td>
                <td data-label="Action">
                  <RecycleForm fileName={file.name} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h2 className="section-title">Recycle Bin</h2>
      <table className="table" style={{ marginBottom: "2.5rem" }}>
        <thead>
          <tr>
            <th>File</th>
            <th>Size</th>
            <th>Updated</th>
            <th>Restore</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {storageError ? (
            <tr>
              <td colSpan={5}>{storageError}</td>
            </tr>
          ) : recycledQuotations.length === 0 ? (
            <tr>
              <td colSpan={5}>Recycle bin is empty.</td>
            </tr>
          ) : (
            recycledQuotations.map((file) => (
              <tr key={file.name}>
                <td data-label="File">{file.name.replace(/^recycle\//, "")}</td>
                <td data-label="Size">{file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : "-"}</td>
                <td data-label="Updated">{file.updated_at || file.created_at ? new Date(file.updated_at || file.created_at).toISOString().slice(0, 10) : "-"}</td>
                <td data-label="Restore">
                  <form className="inline-form" action="/api/quotations" method="post">
                    <input type="hidden" name="action" value="restore" />
                    <input type="hidden" name="fileName" value={file.name} />
                    <button className="button ghost" type="submit">
                      Restore
                    </button>
                  </form>
                </td>
                <td data-label="Delete">
                  <PurgeForm fileName={file.name} />
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
                <td data-label="Hotel">{row.hotel?.name}</td>
                <td data-label="Project">{row.name}</td>
                <td data-label="Status">{row.status}</td>
                <td data-label="Last Updated">{new Date(row.updatedAt).toISOString().slice(0, 10)}</td>
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
