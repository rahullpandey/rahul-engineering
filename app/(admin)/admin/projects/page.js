import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function createProject(formData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const hotelId = String(formData.get("hotelId") || "");
  const startDate = new Date(String(formData.get("startDate") || ""));
  const endDate = new Date(String(formData.get("endDate") || ""));
  const status = String(formData.get("status") || "PLANNED");

  if (!name || !hotelId) return;

  await prisma.project.create({
    data: { name, hotelId, startDate, endDate, status }
  });
  revalidatePath("/admin/projects");
}

async function deleteProject(formData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.projectAssignment.deleteMany({ where: { projectId: id } });
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
}

export default async function ProjectsPage() {
  const [projects, hotels] = await Promise.all([
    prisma.project.findMany({
      include: { hotel: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.hotel.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Projects</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Track active hotel projects, timelines, and workforce assignments.
      </p>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Add Project</h3>
        <form action={createProject} style={{ display: "grid", gap: "0.8rem" }}>
          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <input name="name" placeholder="Project name" required />
            <select name="hotelId" required defaultValue="">
              <option value="" disabled>Select hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
            <input name="startDate" type="date" required />
            <input name="endDate" type="date" required />
            <select name="status" defaultValue="PLANNED">
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <button className="button primary" type="submit">Save Project</button>
        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Project</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.hotel?.name}</td>
              <td>{project.name}</td>
              <td>{formatDate(project.startDate)}</td>
              <td>{formatDate(project.endDate)}</td>
              <td>{project.status}</td>
              <td style={{ display: "flex", gap: "0.6rem" }}>
                <a className="button ghost" href={`/admin/projects/${project.id}/edit`}>
                  Edit
                </a>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button className="button" type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
