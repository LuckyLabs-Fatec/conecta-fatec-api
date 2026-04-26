-- CreateEnum
CREATE TYPE "user_roles" AS ENUM ('SOCIETY', 'MEDIATOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "user_roles" NOT NULL DEFAULT 'SOCIETY';
