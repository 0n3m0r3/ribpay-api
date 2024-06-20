-- AlterTable
ALTER TABLE "terminals" ADD COLUMN     "terminal_created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
