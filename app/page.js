import prisma from "../lib/prisma";
import CoveragePanel from "./components/CoveragePanel";
import StickyLogoController from "./components/StickyLogoController";
import { COLLABORATIONS, GROUP_ORDER } from "./data/collaborations";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const selectedHotel = searchParams?.hotel || "all";
  const groupedCollaborations = COLLABORATIONS.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});
  const groupNames = [
    ...GROUP_ORDER.filter((group) => groupedCollaborations[group]?.length),
    ...Object.keys(groupedCollaborations).filter((group) => !GROUP_ORDER.includes(group))
  ];
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
      <StickyLogoController />
      <header className="container" style={{ paddingTop: "2.5rem", paddingBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div className="logo-lockup">
            <a className="site-mark" href="/" aria-label="Back to home">
              <div className="logo-architect" aria-hidden>
                <span className="arch-r">R</span>
                <span className="arch-e">E</span>
              </div>
            </a>
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
        <div className="hero-left">
          <div className="badge">Trusted manpower partner for premium hospitality</div>
          <h1>Labour supply and project control in one reliable system.</h1>
          <p>
            Rahul Engineering supports 5-star hotels with trained teams, project coverage, and on-time
            staffing. Our admin portal keeps every employee and assignment record organized.
          </p>
          <div className="hero-meta">
            <span className="hero-pill">24/7 Coverage</span>
            <span className="hero-pill">Verified Teams</span>
            <span className="hero-pill">Audit Ready</span>
          </div>
          <div className="cta-row">
            <a
              className="button primary"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rkpanday257@gmail.com&su=Proposal%20Request%20-%20Rahul%20Engineering"
              target="_blank"
              rel="noreferrer"
            >
              Request a proposal
            </a>
            <a className="button ghost" href="/admin/login">Go to admin portal</a>
          </div>
        </div>
        <div className="card" style={{ position: "relative" }}>
          <span className="experience-badge badge-corner">18 Years of Excellence</span>
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
        <div className="card-grid stagger-grid">
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

      <section className="container" id="coverage">
        <div className="section-head">
          <h2 className="section-title">Service Coverage</h2>
          <p>Active coverage across key hospitality hubs in North India.</p>
        </div>
        <CoveragePanel />
      </section>

      <section className="container" id="projects">
        <div className="section-head">
          <h2 className="section-title">Ongoing Projects</h2>
          <p>Live coverage across premium hotels with active manpower teams.</p>
        </div>
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
        <div className="card-grid stagger-grid">
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
              <div className="card project-card" key={project.id}>
                <div className="project-top">
                  <h3>{project.name}</h3>
                  <span className={`status-pill status-${project.status?.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <p style={{ color: "var(--muted)", marginBottom: "0.6rem" }}>
                  {project.hotel?.name || "Hotel partner"}
                </p>
                <div className="project-meta">
                  <div>
                    <span>Start</span>
                    <strong>{new Date(project.startDate).toISOString().slice(0, 10)}</strong>
                  </div>
                  <div>
                    <span>End</span>
                    <strong>{new Date(project.endDate).toISOString().slice(0, 10)}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="container" id="collaborations">
        <div className="section-head">
          <h2 className="section-title">Collaborations</h2>
          <p>Trusted partnerships with India’s leading hospitality brands.</p>
        </div>
        <div className="logo-slider">
          <div className="logo-track">
            {groupNames.flatMap((group) => groupedCollaborations[group]).map((item) => (
              <a
                key={`${item.group}-${item.name}`}
                className="logo-pill"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            ))}
            {groupNames.flatMap((group) => groupedCollaborations[group]).map((item, idx) => (
              <a
                key={`${item.group}-${item.name}-dup-${idx}`}
                className="logo-pill"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container" id="timeline">
        <div className="section-head">
          <h2 className="section-title">Partnership Timeline</h2>
          <p>Highlights of long-term hotel collaborations.</p>
        </div>
        <div className="timeline-grid">
          <div className="timeline-card">
            <span>2008</span>
            <strong>Foundation Year</strong>
            <p>Launched premium hospitality staffing operations.</p>
          </div>
          <div className="timeline-card">
            <span>2014</span>
            <strong>Luxury Expansion</strong>
            <p>Expanded to multi-city luxury hotel partnerships.</p>
          </div>
          <div className="timeline-card">
            <span>2019</span>
            <strong>Operations Scale</strong>
            <p>Introduced centralized reporting and QA programs.</p>
          </div>
          <div className="timeline-card">
            <span>2024</span>
            <strong>Premium Network</strong>
            <p>Strengthened coverage across premium hotel groups.</p>
          </div>
        </div>
      </section>

      <section className="container" id="contact">
        <div className="contact-panel">
          <div>
            <h2>Contact Rahul Engineering</h2>
            <p style={{ color: "var(--muted)", marginBottom: "1.4rem" }}>
              Share your hotel requirements and we will respond with a tailored manpower plan.
            </p>
            <div className="contact-chips">
              <a className="contact-chip" href="tel:+919891750035">Call +91 9891750035</a>
              <a className="contact-chip" href="tel:+917982987790">Call +91 7982987790</a>
              <a className="contact-chip" href="https://mail.google.com/mail/?view=cm&fs=1&to=rkpanday257@gmail.com&su=Proposal%20Request%20-%20Rahul%20Engineering" target="_blank" rel="noreferrer">
                Email Us
              </a>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-row">
              <div>
                <strong>Office</strong>
                <div style={{ color: "var(--muted)" }}>
                  169-A, Nyay Khand -1st, Indirapuram, Ghaziabad, Uttar Pradesh, 201014
                </div>
              </div>
              <a
                className="button ghost"
                href="https://www.google.com/maps/search/?api=1&query=169-A%2C%20Nyay%20Khand%20-1st%2C%20Indirapuram%2C%20Ghaziabad%2C%20Uttar%20Pradesh%2C%20201014"
                target="_blank"
                rel="noreferrer"
              >
                Open Map
              </a>
            </div>
            <div className="contact-row">
              <div>
                <strong>Email</strong>
                <div style={{ color: "var(--muted)" }}>rkpanday257@gmail.com</div>
              </div>
              <div>
                <strong>Working Hours</strong>
                <div style={{ color: "var(--muted)" }}>24/7</div>
              </div>
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
