-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "contract_created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
