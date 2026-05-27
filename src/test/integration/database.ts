import { getPrismaClient } from "@/infra/database/prisma/client";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:55432/conecta_fatec_test";
process.env.DIRECT_URL ??= "postgresql://postgres:postgres@localhost:55432/conecta_fatec_test";
process.env.PRISMA_DRIVER_ADAPTER ??= "pg";
process.env.JWT_SECRET ??= "test-secret";
process.env.JWT_EXPIRES_IN ??= "1h";
process.env.CORS_ORIGIN ??= "http://localhost:3000";

export const prisma = getPrismaClient();

export async function resetDatabase(): Promise<void> {
  await prisma.projectStudent.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.project.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
