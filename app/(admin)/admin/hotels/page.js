import { revalidatePath } from "next/cache";
import prisma from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function createHotel(formData) {
  "use server";
  const name = String(formData.get("name") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const contactPerson = String(formData.get("contactPerson") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contractStart = new Date(String(formData.get("contractStart") || ""));
  const contractEnd = new Date(String(formData.get("contractEnd") || ""));

  if (!name || !address || !contactPerson || !contactPhone || !contactEmail) return;

  await prisma.hotel.create({
    data: { name, address, contactPerson, contactPhone, contactEmail, contractStart, contractEnd }
  });
  revalidatePath("/admin/hotels");
}

async function deleteHotel(formData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.projectAssignment.deleteMany({ where: { project: { hotelId: id } } });
  await prisma.project.deleteMany({ where: { hotelId: id } });
  await prisma.hotel.delete({ where: { id } });
  revalidatePath("/admin/hotels");
}

export default async function HotelsPage() {
  const hotels = await prisma.hotel.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Hotels</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Manage client properties, contracts, and primary contacts.
      </p>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>Add Hotel</h3>
        <form action={createHotel} style={{ display: "grid", gap: "0.8rem" }}>
          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <input name="name" placeholder="Hotel name" required />
            <input name="address" placeholder="Address" required />
            <input name="contactPerson" placeholder="Contact person" required />
            <input name="contactPhone" placeholder="Phone" required />
            <input name="contactEmail" placeholder="Email" type="email" required />
            <input name="contractStart" type="date" required />
            <input name="contractEnd" type="date" required />
          </div>
          <button className="button primary" type="submit">Save Hotel</button>
        </form>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Contract Start</th>
            <th>Contract End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.contactPerson}</td>
              <td>{hotel.contactPhone}</td>
              <td>{hotel.contactEmail}</td>
              <td>{formatDate(hotel.contractStart)}</td>
              <td>{formatDate(hotel.contractEnd)}</td>
              <td style={{ display: "flex", gap: "0.6rem" }}>
                <a className="button ghost" href={`/admin/hotels/${hotel.id}/edit`}>
                  Edit
                </a>
                <form action={deleteHotel}>
                  <input type="hidden" name="id" value={hotel.id} />
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
