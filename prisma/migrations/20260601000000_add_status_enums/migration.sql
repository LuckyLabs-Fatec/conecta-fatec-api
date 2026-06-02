-- CreateEnum
CREATE TYPE "proposal_status" AS ENUM ('PRE_APPROVED', 'APPROVED', 'REJECTED', 'IN_REVIEW');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('IN_DEVELOPMENT', 'PENDING', 'COMPLETED');

-- Normalize proposal statuses before replacing the varchar column type.
UPDATE "proposals"
SET "status" = CASE
  WHEN UPPER(TRIM("status")) IN ('PRE_APPROVED', 'PRE_APROVADO') THEN 'PRE_APPROVED'
  WHEN UPPER(TRIM("status")) IN ('APPROVED', 'APROVADA', 'APROVADO', 'ASSIGNED', 'ATRIBUIDA') THEN 'APPROVED'
  WHEN UPPER(TRIM("status")) IN ('REJECTED', 'REJEITADA', 'REJEITADO') THEN 'REJECTED'
  ELSE 'IN_REVIEW'
END;

-- Normalize project statuses before replacing the varchar column type.
UPDATE "projects"
SET "status" = CASE
  WHEN UPPER(TRIM("status")) IN ('ACTIVE', 'IN_DEVELOPMENT', 'EM_DESENVOLVIMENTO') THEN 'IN_DEVELOPMENT'
  WHEN UPPER(TRIM("status")) IN ('COMPLETED', 'CLOSED', 'CONCLUIDO') THEN 'COMPLETED'
  ELSE 'PENDING'
END;

-- AlterTable
ALTER TABLE "proposals"
ALTER COLUMN "status" TYPE "proposal_status"
USING ("status"::"proposal_status");

-- AlterTable
ALTER TABLE "projects"
ALTER COLUMN "status" TYPE "project_status"
USING ("status"::"project_status");
