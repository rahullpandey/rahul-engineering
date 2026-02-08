import prisma from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const requests = await prisma.proposalRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <section>
      <h1 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>Proposal Requests</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        New client enquiries submitted from the website.
      </p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Hotel</th>
              <th>City</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={8}>No requests yet.</td>
              </tr>
            ) : (
              requests.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.company || "-"}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.hotel || "-"}</td>
                  <td>{item.city || "-"}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toISOString().slice(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
