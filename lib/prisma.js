import { PrismaClient } from "@prisma/client";

globalThis.__prisma__ = globalThis.__prisma__ || new PrismaClient();

const prisma = globalThis.__prisma__;

export default prisma;
