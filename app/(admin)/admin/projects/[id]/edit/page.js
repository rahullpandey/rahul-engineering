import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function updateProject(formData) {
  "use server";
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const hotelId = String(formData.get("hotelId") || "");
  const startDate = new Date(String(formData.get("startDate") || ""));
  const endDate = new Date(String(formData.get("endDate") || ""));
  const status = String(formData.get("status") || "PLANNED");

  if (!id || !name || !hotelId) return;

  await prisma.project.update({
    where: { id },
    data: { name, hotelId, startDate, endDate, status }
  });

  redirect("/admin/projects");
}

export default async function EditProjectPage({ params }) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return (
      <section>
        <h1>Project data loading</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          This page will be available after deployment completes.
        </p>
        <a className="button ghost" href="/admin/projects">Back to Projects</a>
      </section>
    );
  }
  let project = null;
  let hotels = [];
  try {
    [project, hotels] = await Promise.all([
      prisma.project.findUnique({ where: { id: params.id } }),
      prisma.hotel.findMany({ orderBy: { name: "asc" } })
    ]);
  } catch (error) {
    return (
      <section>
        <h1>Project data unavailable</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          The database connection is not available yet. Please try again after the deployment finishes.
        </p>
        <a className="button ghost" href="/admin/projects">Back to Projects</a>
      </section>
    );
  }

  if (!project) {
    return (
      <section>
        <h1>Project not found</h1>
        <a className="button ghost" href="/admin/projects">Back to Projects</a>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Edit Project</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Update details for {project.name}.
      </p>
      <div className="card">
        <form action={updateProject} style={{ display: "grid", gap: "0.8rem" }}>
          <input type="hidden" name="id" value={project.id} />
          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <input name="name" defaultValue={project.name} required />
            <select name="hotelId" defaultValue={project.hotelId} required>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <input name="startDate" type="date" defaultValue={formatDate(project.startDate)} required />
            <input name="endDate" type="date" defaultValue={formatDate(project.endDate)} required />
            <select name="status" defaultValue={project.status}>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button className="button primary" type="submit">Save Changes</button>
            <a className="button ghost" href="/admin/projects">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  );
}
