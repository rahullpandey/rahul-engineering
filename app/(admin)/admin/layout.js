export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <div className="logo-architect admin-logo" aria-hidden>
              <span className="arch-r">R</span>
              <span className="arch-e">E</span>
            </div>
            <div className="admin-brand-text">
              <div className="admin-wordmark">Rahul Engineering</div>
              <div className="admin-subtitle">Admin Portal</div>
            </div>
          </div>
        </div>
        <nav className="admin-nav">
          <a href="/admin">Dashboard</a>
          <a href="/admin/employees">Employees</a>
          <a href="/admin/hotels">Hotels</a>
          <a href="/admin/projects">Projects</a>
          <a href="/admin/requests">Requests</a>
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
