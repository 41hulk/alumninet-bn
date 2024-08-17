-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "updatedAt" DROP NOT NULL;
