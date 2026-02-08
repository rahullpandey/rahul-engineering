export const runtime = "nodejs";

function normalizePhone(input) {
  const digits = (input || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const phone = normalizePhone(body.phone);

  if (!phone) {
    return new Response("Phone number is required.", { status: 400 });
  }

  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  const senderId = process.env.MSG91_SENDER_ID;
  const otpUrl = process.env.MSG91_OTP_URL || "https://control.msg91.com/api/v5/otp";
  const otpLength = process.env.MSG91_OTP_LENGTH;
  const otpExpiry = process.env.MSG91_OTP_EXPIRY;

  if (!authKey || !templateId) {
    return new Response("MSG91 is not configured.", { status: 500 });
  }

  const params = new URLSearchParams({
    template_id: templateId,
    mobile: phone,
    authkey: authKey
  });

  if (senderId) params.set("sender", senderId);
  if (otpLength) params.set("otp_length", otpLength);
  if (otpExpiry) params.set("otp_expiry", otpExpiry);

  const response = await fetch(`${otpUrl}?${params.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return new Response(data?.message || "Failed to send OTP.", { status: 500 });
  }

  return Response.json({ success: true, requestId: data?.request_id || data?.requestId || null });
}
