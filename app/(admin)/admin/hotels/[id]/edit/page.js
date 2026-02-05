import { redirect } from "next/navigation";
import prisma from "../../../../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

async function updateHotel(formData) {
  "use server";
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const contactPerson = String(formData.get("contactPerson") || "").trim();
  const contactPhone = String(formData.get("contactPhone") || "").trim();
  const contactEmail = String(formData.get("contactEmail") || "").trim();
  const contractStart = new Date(String(formData.get("contractStart") || ""));
  const contractEnd = new Date(String(formData.get("contractEnd") || ""));

  if (!id || !name || !address || !contactPerson || !contactPhone || !contactEmail) return;

  await prisma.hotel.update({
    where: { id },
    data: { name, address, contactPerson, contactPhone, contactEmail, contractStart, contractEnd }
  });

  redirect("/admin/hotels");
}

export default async function EditHotelPage({ params }) {
  const hotel = await prisma.hotel.findUnique({ where: { id: params.id } });

  if (!hotel) {
    return (
      <section>
        <h1>Hotel not found</h1>
        <a className="button ghost" href="/admin/hotels">Back to Hotels</a>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Edit Hotel</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        Update details for {hotel.name}.
      </p>
      <div className="card">
        <form action={updateHotel} style={{ display: "grid", gap: "0.8rem" }}>
          <input type="hidden" name="id" value={hotel.id} />
          <div style={{ display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <input name="name" defaultValue={hotel.name} required />
            <input name="address" defaultValue={hotel.address} required />
            <input name="contactPerson" defaultValue={hotel.contactPerson} required />
            <input name="contactPhone" defaultValue={hotel.contactPhone} required />
            <input name="contactEmail" type="email" defaultValue={hotel.contactEmail} required />
            <input name="contractStart" type="date" defaultValue={formatDate(hotel.contractStart)} required />
            <input name="contractEnd" type="date" defaultValue={formatDate(hotel.contractEnd)} required />
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <button className="button primary" type="submit">Save Changes</button>
            <a className="button ghost" href="/admin/hotels">Cancel</a>
          </div>
        </form>
      </div>
    </section>
  );
}
