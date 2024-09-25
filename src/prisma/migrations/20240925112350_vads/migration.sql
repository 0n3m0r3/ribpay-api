-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "contract_3d_secure" BOOLEAN,
ADD COLUMN     "contract_bank_code" VARCHAR(5),
ADD COLUMN     "contract_bank_name" VARCHAR(255),
ADD COLUMN     "contract_is_active" BOOLEAN,
ADD COLUMN     "contract_max_amount" INTEGER;
