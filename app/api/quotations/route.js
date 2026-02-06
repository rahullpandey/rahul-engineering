export const runtime = "nodejs";

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getStorageConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_QUOTATIONS_BUCKET || "quotations";

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  return { supabaseUrl, serviceKey, bucket };
}

export async function POST(request) {
  const config = getStorageConfig();

  if (!config) {
    return new Response("Supabase storage is not configured.", { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return new Response("No file provided.", { status: 400 });
  }

  const fileName = sanitizeFileName(file.name || "quotation");
  const storedName = `${Date.now()}-${fileName}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const uploadResponse = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${storedName}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.serviceKey}`,
        apikey: config.serviceKey,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false"
      },
      body: fileBuffer
    }
  );

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    return new Response(`Upload failed: ${errorText}`, { status: 500 });
  }

  return Response.redirect(new URL("/admin#quotations", request.url), 302);
}

export async function GET(request) {
  const config = getStorageConfig();

  if (!config) {
    return new Response("Supabase storage is not configured.", { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file || file.includes("/") || file.includes("..")) {
    return new Response("Invalid file name.", { status: 400 });
  }

  const fetchResponse = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${config.bucket}/${encodeURIComponent(file)}`,
    {
      headers: {
        Authorization: `Bearer ${config.serviceKey}`,
        apikey: config.serviceKey
      }
    }
  );

  if (!fetchResponse.ok) {
    return new Response("File not found.", { status: 404 });
  }

  const contentType = fetchResponse.headers.get("content-type") || "application/octet-stream";
  const fileBuffer = await fetchResponse.arrayBuffer();

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${file}"`
    }
  });
}
