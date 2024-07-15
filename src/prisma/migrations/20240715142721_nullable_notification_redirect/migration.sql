-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "transaction_redirect_url" DROP NOT NULL,
ALTER COLUMN "transaction_notification_url" DROP NOT NULL;
