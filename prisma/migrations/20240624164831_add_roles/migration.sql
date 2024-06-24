-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ALUMN', 'FACILITATOR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ALUMN';
