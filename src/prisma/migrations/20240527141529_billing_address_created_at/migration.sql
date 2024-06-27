-- AlterTable
ALTER TABLE "billing_addresses" ADD COLUMN     "billing_address_created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
