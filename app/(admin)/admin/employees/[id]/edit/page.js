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

async function updateEmployee(formData) {
  "use server";
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const wageRate = Number(formData.get("wageRate") || 0);
  const idProof = String(formData.get("idProof") || "").trim();
  const joiningDate = new Date(String(formData.get("joiningDate") || ""));
  const status = String(formData.get("status") || "ACTIVE");

  if (!id || !name || !phone || !role || !idProof || Number.isNaN(wageRate) || !joiningDate) {
    return;
  }

  await prisma.employee.update({
    where: { id },
    data: { name, phone, role, wageRate, idProof, joiningDate, status }
  });

  redirect("/admin/employees");
}

export default async function EditEmployeePage({ params }) {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return (
      <section>
        <h1>Employee data loading</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          This page will be available after deployment completes.
        </p>
        <a className="button ghost" href="/admin/employees">Back to Employees</a>
      </section>
    );
  }
  let employee = null;
  try {
    employee = await prisma.employee.findUnique({ where: { id: params.id } });
  } catch (error) {
    return (
      <section>
        <h1>Employee data unavailable</h1>
        <p style={{ color: "var(--muted)", marginBottom: "1rem" }}>
          The database connection is not available yet. Please try again after the deployment finishes.
        </p>
        <a className="button ghost" href="/admin/employees">Back to Employees</a>
      </section>
    );
  }

  if (!employee) {
    return (
      <section>
        <h1>Employee not found</h1>
        <a className="button ghost" href="/admin/employees">Back to Employees</a>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Edit Employee</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Update details for {employee.name}.
      </p>
      <div className="card">
        <form action={updateEmployee} style={{ display: "grid", gap: "0.8rem" }}>
          <input type="hidden" name="id" value={employee.id} />
          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <input name="name" defaultValue={employee.name} required />
            <input name="phone" defaultValue={employee.phone} required />
            <input name="role" defaultValue={employee.role} required />
            <input name="wageRate" type="number" step="0.01" defaultValue={employee.wageRate} required />
            <input name="idProof" defaultValue={employee.idProof} required />
            <input name="joiningDate" type="date" defaultValue={formatDate(employee.joiningDate)} required />
            <select name="status" defaultValue={employee.status}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button className="button primary" type="submit">Save Changes</button>
            <a className="button ghost" href="/admin/employees">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  );
}
