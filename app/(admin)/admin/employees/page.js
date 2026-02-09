import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function createEmployee(formData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "").trim();
  const wageRate = Number(formData.get("wageRate") || 0);
  const idProof = String(formData.get("idProof") || "").trim();
  const joiningDate = new Date(String(formData.get("joiningDate") || ""));
  const status = String(formData.get("status") || "ACTIVE");

  if (!name || !phone || !role || !idProof || Number.isNaN(wageRate) || !joiningDate) {
    return;
  }

  await prisma.employee.create({
    data: { name, phone, role, wageRate, idProof, joiningDate, status }
  });
  revalidatePath("/admin/employees");
}

async function deleteEmployee(formData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.projectAssignment.deleteMany({ where: { employeeId: id } });
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/admin/employees");
}

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Employees</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Maintain employee profiles, wage rates, and availability.
      </p>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Add Employee</h3>
        <form action={createEmployee} className="admin-form">
          <div className="admin-form-grid">
            <input name="name" placeholder="Full name" required />
            <input name="phone" placeholder="Phone" required />
            <input name="role" placeholder="Role" required />
            <input name="wageRate" placeholder="Wage rate" type="number" step="0.01" required />
            <input name="idProof" placeholder="ID proof" required />
            <input name="joiningDate" type="date" required />
            <select name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <button className="button primary" type="submit">Save Employee</button>
        </form>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Wage Rate</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td data-label="Name">{employee.name}</td>
                <td data-label="Phone">{employee.phone}</td>
                <td data-label="Role">{employee.role}</td>
                <td data-label="Wage Rate">{employee.wageRate}</td>
                <td data-label="Joining Date">{formatDate(employee.joiningDate)}</td>
                <td data-label="Status">{employee.status}</td>
                <td data-label="Actions">
                  <div className="admin-table-actions">
                    <a className="button ghost" href={`/admin/employees/${employee.id}/edit`}>
                      Edit
                    </a>
                    <form action={deleteEmployee}>
                      <input type="hidden" name="id" value={employee.id} />
                      <button className="button" type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
