import { readFile } from "fs/promises";
import path from "path";
import prisma from "../../../lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") || "docx").toLowerCase();
  const isExcel = format === "xlsx" || format === "excel";
  const templateFile = isExcel ? "letter-head.xlsx" : "letter-head.docx";
  const filePath = path.join(process.cwd(), "public", "templates", templateFile);
  let fileBuffer;

  try {
    fileBuffer = await readFile(filePath);
  } catch (error) {
    return new Response("Template not found.", { status: 404 });
  }

  try {
    await prisma.quotation.create({
      data: {
        format: isExcel ? "EXCEL" : "WORD",
        templateFile
      }
    });
  } catch (error) {
    // Best-effort logging; still return the file even if DB is unavailable.
  }

  const contentType = isExcel
    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return new Response(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${templateFile}"`
    }
  });
}
