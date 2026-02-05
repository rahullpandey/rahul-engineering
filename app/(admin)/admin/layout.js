export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div className="logo-architect" aria-hidden>
              <span className="arch-r">R</span>
              <span className="arch-e">E</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Rahul Engineering</div>
              <div style={{ color: "#6c6a66", fontSize: "0.9rem" }}>Admin Portal</div>
            </div>
          </div>
        </div>
        <nav style={{ display: "grid", gap: "0.5rem" }}>
          <a href="/admin">Dashboard</a>
          <a href="/admin/employees">Employees</a>
          <a href="/admin/hotels">Hotels</a>
          <a href="/admin/projects">Projects</a>
        </nav>
        <form method="post" action="/api/auth/logout" style={{ marginTop: "auto" }}>
          <button
            className="button ghost"
            type="submit"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Sign out
          </button>
        </form>
        <div style={{ fontSize: "0.85rem", color: "#6c6a66" }}>
          Admin-only access
        </div>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
