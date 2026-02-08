import prisma from "../../../lib/prisma";

export async function POST(request) {
  const formData = await request.formData();
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const phone = (formData.get("phone") || "").toString().trim();
  const company = (formData.get("company") || "").toString().trim();
  const hotel = (formData.get("hotel") || "").toString().trim();
  const city = (formData.get("city") || "").toString().trim();
  const message = (formData.get("message") || "").toString().trim();

  if (!name || !email || !phone) {
    return new Response("Missing required fields.", { status: 400 });
  }

  try {
    await prisma.proposalRequest.create({
      data: {
        name,
        email,
        phone,
        company: company || null,
        hotel: hotel || null,
        city: city || null,
        message: message || null
      }
    });
  } catch (error) {
    return new Response("Unable to submit request.", { status: 500 });
  }

  return Response.redirect(new URL("/?submitted=1#proposal", request.url), 303);
}
