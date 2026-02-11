import prisma from "../lib/prisma";
import CoveragePanel from "./components/CoveragePanel";
import StickyLogoController from "./components/StickyLogoController";
import { COLLABORATIONS, GROUP_ORDER } from "./data/collaborations";

const description =
  "Trusted manpower partner for premium hospitality. We support 5-star hotels with trained teams, project coverage, and on-time staffing.";

export const metadata = {
  title: "Rahul Engineering",
  description,
  openGraph: {
    title: "Rahul Engineering",
    description,
    url: "https://www.rahulengineerings.com",
    siteName: "Rahul Engineering",
    type: "website",
    images: [
      {
        url: "https://www.rahulengineerings.com/og.jpg?v=3",
        width: 1200,
        height: 630,
        alt: "Rahul Engineering"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Engineering",
    description,
    images: ["https://www.rahulengineerings.com/og.jpg?v=3"]
  }
};

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const selectedHotel = searchParams?.hotel || "all";
  const selectedStatus = searchParams?.status || "all";
  const selectedCity = searchParams?.city || "all";
  const proposalSubmitted = searchParams?.submitted === "1";
  const groupedCollaborations = COLLABORATIONS.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});
  const groupNames = [
    ...GROUP_ORDER.filter((group) => groupedCollaborations[group]?.length),
    ...Object.keys(groupedCollaborations).filter((group) => !GROUP_ORDER.includes(group))
  ];
  const marqueeItems = groupNames.flatMap((group) => groupedCollaborations[group]);
  const marqueeLoop = [...marqueeItems, ...marqueeItems];
  let projects = [];
  let hotels = [];
  let employeeCount = 0;
  let hotelCount = 0;
  let projectCount = 0;
  let dbAvailable = true;

  try {
    const projectWhere = {};
    if (selectedHotel !== "all") projectWhere.hotelId = selectedHotel;
    if (selectedStatus !== "all") projectWhere.status = selectedStatus;

    const [projectsData, hotelsData, employeesData, projectsTotal] = await Promise.all([
      prisma.project.findMany({
        include: { hotel: true },
        where: Object.keys(projectWhere).length ? projectWhere : undefined,
        orderBy: { startDate: "desc" }
      }),
      prisma.hotel.findMany({ orderBy: { name: "asc" } }),
      prisma.employee.count(),
      prisma.project.count()
    ]);

    projects = projectsData;
    hotels = hotelsData;
    employeeCount = employeesData;
    hotelCount = hotelsData.length;
    projectCount = projectsTotal;
  } catch (error) {
    dbAvailable = false;
  }

  const cityOptions = Array.from(
    new Set(
      hotels
        .map((hotel) => {
          if (!hotel.address) return null;
          const parts = hotel.address.split(",").map((part) => part.trim()).filter(Boolean);
          if (parts.length >= 2) return parts[parts.length - 2];
          return parts[0] || null;
        })
        .filter(Boolean)
    )
  ).sort();

  if (selectedCity !== "all") {
    const needle = selectedCity.toLowerCase();
    projects = projects.filter((project) => {
      const address = (project.hotel?.address || "").toLowerCase();
      const name = (project.hotel?.name || "").toLowerCase();
      return address.includes(needle) || name.includes(needle);
    });
  }

  const snapshot = {
    employees: 128,
    projects: 14,
    hotels: 9,
    response: "24h"
  };

  const sampleProjects = [
    {
      id: "sample-1",
      name: "Luxury Banquet Expansion Program",
      status: "ACTIVE",
      hotel: { name: "The Oberoi, New Delhi" },
      city: "Delhi NCR",
      startDate: "2026-01-05",
      endDate: "2026-06-30"
    },
    {
      id: "sample-2",
      name: "Resort Staffing Operations Overhaul",
      status: "ACTIVE",
      hotel: { name: "ITC Grand Bharat, Gurugram" },
      city: "Gurgaon",
      startDate: "2026-01-20",
      endDate: "2026-07-15"
    },
    {
      id: "sample-3",
      name: "Royal Suite Service Coverage",
      status: "PLANNED",
      hotel: { name: "The Oberoi Amarvilas, Agra" },
      city: "Agra",
      startDate: "2026-02-15",
      endDate: "2026-08-01"
    },
    {
      id: "sample-4",
      name: "Premium Guest Services Rollout",
      status: "ON_HOLD",
      hotel: { name: "The Lalit, New Delhi" },
      city: "Delhi NCR",
      startDate: "2026-02-01",
      endDate: "2026-05-30"
    }
  ];

  const baseProjects = projects.length ? projects : sampleProjects;

  const cityOptionsFromProjects = Array.from(
    new Set(
      baseProjects
        .map((project) => project.city)
        .filter(Boolean)
    )
  ).sort();

  const cityOptionsFinal = cityOptions.length ? cityOptions : cityOptionsFromProjects;

  let displayProjects = baseProjects;
  if (selectedStatus !== "all") {
    displayProjects = displayProjects.filter((project) => project.status === selectedStatus);
  }
  if (selectedCity !== "all") {
    const needle = selectedCity.toLowerCase();
    displayProjects = displayProjects.filter((project) => {
      const projectCity = (project.city || "").toLowerCase();
      const address = (project.hotel?.address || "").toLowerCase();
      const name = (project.hotel?.name || "").toLowerCase();
      return projectCity.includes(needle) || address.includes(needle) || name.includes(needle);
    });
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
            <a className="button primary" href="#proposal">
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
            <div className="kpi"><span>Active Employees</span><strong>{snapshot.employees}</strong></div>
            <div className="kpi"><span>Hotel Projects</span><strong>{snapshot.projects}</strong></div>
            <div className="kpi"><span>Hotels Covered</span><strong>{snapshot.hotels}</strong></div>
            <div className="kpi"><span>Response Time</span><strong>{snapshot.response}</strong></div>
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

      <section className="collaboration-band" id="collaborations">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Collaborations</h2>
            <p>Trusted partnerships with India’s leading hospitality brands.</p>
          </div>
        </div>
        <div className="logo-slider">
          <div className="logo-track">
            {marqueeLoop.map((item, index) =>
              item.url ? (
                <a
                  key={`${item.group}-${item.name}-${index}`}
                  className="logo-pill"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name}
                </a>
              ) : (
                <span key={`${item.group}-${item.name}-${index}`} className="logo-pill logo-pill--static">
                  {item.name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section className="container" id="operations">
        <div className="section-head">
          <h2 className="section-title">How We Work</h2>
          <p>Structured workflows that keep staffing, compliance, and reporting aligned.</p>
        </div>
        <div className="card-grid stagger-grid process-grid">
          <div className="card process-card">
            <span className="process-label">Step 01</span>
            <h3>Compliance & Documentation</h3>
            <p>Verified IDs, contracts, and wage records maintained for audit readiness.</p>
          </div>
          <div className="card process-card">
            <span className="process-label">Step 02</span>
            <h3>Client Coordination</h3>
            <p>Dedicated account leads align rosters, SLAs, and shift requirements.</p>
          </div>
          <div className="card process-card">
            <span className="process-label">Step 03</span>
            <h3>Performance Reporting</h3>
            <p>Weekly KPI summaries on manpower allocation, costs, and service quality.</p>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
            <label htmlFor="city" style={{ fontWeight: 600 }}>
              Filter by city
            </label>
            <select id="city" name="city" defaultValue={selectedCity}>
              <option value="all">All cities</option>
              {cityOptionsFinal.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <label htmlFor="status" style={{ fontWeight: 600 }}>
              Filter by status
            </label>
            <select id="status" name="status" defaultValue={selectedStatus}>
              <option value="all">All statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button className="button ghost" type="submit">
              Apply Filter
            </button>
          </form>
        ) : null}
        <div className="card-grid stagger-grid">
          {displayProjects.map((project) => (
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
                  <span>Service Status</span>
                  <strong>{project.status === "ACTIVE" ? "In progress" : project.status}</strong>
                </div>
                <div>
                  <span>Coverage</span>
                  <strong>Active teams</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container" id="timeline">
        <div className="section-head">
          <h2 className="section-title">Partnership Timeline</h2>
          <p>Highlights of long-term hotel collaborations.</p>
        </div>
        <div className="timeline-grid stagger-grid">
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

      <section className="container" id="proposal">
        <div className="section-head">
          <h2 className="section-title">Request a Proposal</h2>
          <p>Send your requirements and our team will respond quickly.</p>
        </div>
        <div className="proposal-panel">
          <form className="proposal-form" action="/api/proposals" method="post">
            <div className="proposal-grid">
              <label>
                Full name
                <input name="name" placeholder="Your name" required />
              </label>
              <label>
                Company
                <input name="company" placeholder="Company (optional)" />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Phone
                <input name="phone" placeholder="+91..." required />
              </label>
              <label>
                Hotel / Property
                <input name="hotel" placeholder="Hotel name (optional)" />
              </label>
              <label>
                City
                <input name="city" placeholder="City (optional)" />
              </label>
            </div>
            <label>
              Requirements
              <textarea name="message" rows={4} placeholder="Tell us about staffing or project needs." />
            </label>
            <div className="proposal-actions">
              <button className="button primary" type="submit">
                Submit request
              </button>
              <a
                className="button ghost"
                href="https://mail.google.com/mail/?view=cm&fs=1&to=rkpanday257@gmail.com&su=Proposal%20Request%20-%20Rahul%20Engineering"
                target="_blank"
                rel="noreferrer"
              >
                Email us instead
              </a>
            </div>
            {proposalSubmitted ? (
              <p className="proposal-success">Thanks! Your request has been submitted.</p>
            ) : null}
          </form>
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
