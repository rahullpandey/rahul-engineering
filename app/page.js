import prisma from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const selectedHotel = searchParams?.hotel || "all";
  let projects = [];
  let hotels = [];
  let dbAvailable = true;

  try {
    [projects, hotels] = await Promise.all([
      prisma.project.findMany({
        include: { hotel: true },
        where: selectedHotel === "all" ? undefined : { hotelId: selectedHotel },
        orderBy: { startDate: "desc" }
      }),
      prisma.hotel.findMany({ orderBy: { name: "asc" } })
    ]);
  } catch (error) {
    dbAvailable = false;
  }

  return (
    <main>
      <header className="container" style={{ paddingTop: "2.5rem", paddingBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div className="logo-lockup">
            <div className="logo-seal" aria-hidden>
              <span>RE</span>
            </div>
            <div>
              <div
                className="logo-wordmark"
                style={{
                  fontWeight: 700,
                  fontSize: "3.1rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  fontFamily: "\"Playfair Display\", \"Times New Roman\", serif"
                }}
              >
                Rahul Engineering
              </div>
              <span className="logo-underline" />
            </div>
          </div>
          <div style={{ color: "var(--muted)", marginTop: "0.6rem", letterSpacing: "0.1em" }}>
            Hospitality Workforce & Project Management
          </div>
        </div>
        <nav className="nav-links" style={{ justifyContent: "center", marginTop: "1.2rem" }}>
          <a href="#services">Services</a>
          <a href="#operations">Operations</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a href="/admin/login">Admin</a>
        </nav>
      </header>

      <section className="container hero" style={{ position: "relative" }}>
        <div>
          <div className="badge">Trusted manpower partner for premium hospitality</div>
          <h1>Labour supply and project control in one reliable system.</h1>
          <p>
            Rahul Engineering supports 5-star hotels with trained teams, project coverage, and on-time
            staffing. Our admin portal keeps every employee and assignment record organized.
          </p>
          <div className="cta-row">
            <a className="button primary" href="#contact">Request a proposal</a>
            <a className="button ghost" href="/admin/login">Go to admin portal</a>
          </div>
        </div>
        <div className="card">
          <h3>Operational Snapshot</h3>
          <p style={{ marginBottom: "1.2rem", color: "var(--muted)" }}>
            Real-time visibility across workforce and hotel projects.
          </p>
          <div className="kpi-grid">
            <div className="kpi"><span>Active Employees</span><strong>128</strong></div>
            <div className="kpi"><span>Hotel Projects</span><strong>14</strong></div>
            <div className="kpi"><span>Hotels Covered</span><strong>9</strong></div>
            <div className="kpi"><span>Response Time</span><strong>24h</strong></div>
          </div>
          <div style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Admin-only access for internal management.
          </div>
        </div>
      </section>

      <section className="container" id="services">
        <h2 className="section-title">What We Handle</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Hotel Staffing</h3>
            <p>Housekeeping, banquet, kitchen support, and front-of-house teams aligned to premium standards.</p>
          </div>
          <div className="card">
            <h3>Shift Coverage</h3>
            <p>Daily staffing, quick replacements, and compliance tracking to keep service seamless.</p>
          </div>
          <div className="card">
            <h3>Project Management</h3>
            <p>Track every hotel project by timeline, cost, and manpower deployment.</p>
          </div>
          <div className="card">
            <h3>Quality Assurance</h3>
            <p>Regular audits, team briefings, and training for consistent guest experiences.</p>
          </div>
        </div>
      </section>

      <section className="container" id="operations">
        <h2 className="section-title">How We Work</h2>
        <div className="card-grid">
          <div className="card">
            <h3>Centralized Records</h3>
            <p>All employee documents and wage rates stored securely.</p>
          </div>
          <div className="card">
            <h3>Hotel Collaboration</h3>
            <p>Dedicated point of contact for each property with clear contract milestones.</p>
          </div>
          <div className="card">
            <h3>Real-time Reporting</h3>
            <p>Weekly and monthly reports for manpower allocation and cost tracking.</p>
          </div>
        </div>
      </section>

      <section className="container" id="projects">
        <h2 className="section-title">Ongoing Projects</h2>
        {dbAvailable ? (
          <form
            method="get"
            style={{
              display: "grid",
              gap: "0.6rem",
              gridTemplateColumns: "minmax(220px, 320px)",
              marginBottom: "1.2rem"
            }}
          >
            <label htmlFor="hotel" style={{ fontWeight: 600 }}>
              Filter by hotel
            </label>
            <select id="hotel" name="hotel" defaultValue={selectedHotel}>
              <option value="all">All hotels</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <button className="button ghost" type="submit">
              Apply Filter
            </button>
          </form>
        ) : null}
        <div className="card-grid">
          {projects.length === 0 ? (
            <div className="card">
              <h3>Projects Updating</h3>
              <p>
                {dbAvailable
                  ? "Our project list is being updated. Please check back soon."
                  : "The projects list is temporarily unavailable. Please check back soon."}
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <div className="card" key={project.id}>
                <h3>{project.name}</h3>
                <p style={{ color: "var(--muted)", marginBottom: "0.6rem" }}>
                  {project.hotel?.name || "Hotel partner"}
                </p>
                <p>
                  Start: {new Date(project.startDate).toISOString().slice(0, 10)} · End:{" "}
                  {new Date(project.endDate).toISOString().slice(0, 10)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="container" id="contact">
        <div className="card" style={{ display: "grid", gap: "1.2rem" }}>
          <h2>Contact Rahul Engineering</h2>
          <p style={{ color: "var(--muted)" }}>
            Share your hotel requirements and we will respond with a tailored manpower plan.
          </p>
          <div className="card-grid">
            <div>
              <strong>Phone</strong>
              <div style={{ color: "var(--muted)" }}>+91 9891750035, +91 7982987790</div>
            </div>
            <div>
              <strong>Email</strong>
              <div style={{ color: "var(--muted)" }}>rkpanday257@gmail.com</div>
            </div>
            <div>
              <strong>Office</strong>
              <div style={{ color: "var(--muted)" }}>
                169-A, Nyay Khand -1st, Indirapuram, Ghaziabad, Uttar Pradesh, 201014
              </div>
            </div>
            <div>
              <strong>Working Hours</strong>
              <div style={{ color: "var(--muted)" }}>24/7</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="container footer">
        Rahul Engineering © {new Date().getFullYear()} · Labour Supply for 5-Star Hotels
      </footer>
    </main>
  );
}
