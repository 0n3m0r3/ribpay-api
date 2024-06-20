-- CreateTable
CREATE TABLE "accounts" (
    "account_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_last_modified" TIMESTAMPTZ(6),
    "account_national_id" VARCHAR(255) NOT NULL,
    "account_name" VARCHAR(255) NOT NULL,
    "account_type" VARCHAR(255) NOT NULL,
    "account_is_active" BOOLEAN NOT NULL,
    "account_deletion_date" TIMESTAMPTZ(6),
    "account_created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_currency" VARCHAR(255) NOT NULL,
    "account_notification_email" VARCHAR(255) NOT NULL,
    "partner_id" UUID,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "billing_addresses" (
    "billing_address_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "billing_address_last_modified" TIMESTAMPTZ(6),
    "billing_address" VARCHAR(255) NOT NULL,
    "billing_address_complement_localisation" VARCHAR(255),
    "billing_address_numero_voie" VARCHAR(255),
    "billing_address_indice_repetition" VARCHAR(255),
    "billing_address_type_voie" VARCHAR(255),
    "billing_address_libelle_voie" VARCHAR(255),
    "billing_address_distribution_speciale" VARCHAR(255),
    "billing_address_code_postal" VARCHAR(255),
    "billing_address_libelle_commune" VARCHAR(255),
    "billing_address_code_pays" VARCHAR(255),
    "billing_address_pays" VARCHAR(255),
    "account_id" UUID NOT NULL,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "billing_addresses_pkey" PRIMARY KEY ("billing_address_id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "contract_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contract_last_modified" TIMESTAMPTZ(6),
    "contract_type" VARCHAR(255) NOT NULL,
    "contract_number" VARCHAR(255) NOT NULL,
    "contract_subscription_id" VARCHAR(255) NOT NULL,
    "contract_beneficiary_name" VARCHAR(255) NOT NULL,
    "contract_merchant_id" VARCHAR(255) NOT NULL,
    "contract_alias_id" VARCHAR(255),
    "terminal_id" UUID,
    "account_id" UUID NOT NULL,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "installments" (
    "installment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "installment_last_modified" TIMESTAMPTZ(6),
    "installment_status" VARCHAR(255),
    "installment_occurences" INTEGER,
    "installment_vat" INTEGER,
    "installment_currency" VARCHAR(255),
    "installment_total_amount_without_vat" VARCHAR(255),
    "installment_paid_amount_without_vat" VARCHAR(255),
    "installment_created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "account_id" UUID,
    "terminal_id" UUID,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "installments_pkey" PRIMARY KEY ("installment_id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "invoice_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "invoice_last_modified" TIMESTAMPTZ(6),
    "invoice_number" VARCHAR(255) NOT NULL,
    "invoice_month" VARCHAR(255) NOT NULL,
    "invoice_created_at" TIMESTAMPTZ(6),
    "invoice_status" VARCHAR(255) NOT NULL,
    "invoice_usage_ribpay" INTEGER,
    "invoice_total_amount_cents_without_vat_ribpay" INTEGER,
    "invoice_vat_ribpay" INTEGER,
    "invoice_usage_vads" INTEGER,
    "invoice_total_amount_cents_without_vat_vads" INTEGER,
    "invoice_vat_vads" INTEGER,
    "invoice_total_amount_cents_without_vat" INTEGER NOT NULL,
    "invoice_total_amount_cents" INTEGER NOT NULL,
    "account_id" UUID NOT NULL,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "partners" (
    "partner_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "partner_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("partner_id")
);

-- CreateTable
CREATE TABLE "terminals" (
    "terminal_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "terminal_last_modified" TIMESTAMPTZ(6),
    "terminal_label" VARCHAR(255) NOT NULL,
    "terminal_favorite_contract_type" VARCHAR(255),
    "account_id" UUID NOT NULL,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "terminals_pkey" PRIMARY KEY ("terminal_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "transaction_last_modified" TIMESTAMPTZ(6),
    "transaction_id_oxlin" VARCHAR(255) NOT NULL,
    "transaction_status" VARCHAR(255) NOT NULL,
    "transaction_instant_payment" BOOLEAN NOT NULL,
    "transaction_amount_without_vat" INTEGER NOT NULL,
    "transaction_amount_cents" INTEGER NOT NULL,
    "transaction_currency" VARCHAR(255) NOT NULL,
    "transaction_vat" INTEGER NOT NULL,
    "transaction_label" VARCHAR(255) NOT NULL,
    "transaction_auth_url" VARCHAR(255) NOT NULL,
    "transaction_redirect_url" VARCHAR(255) NOT NULL,
    "transaction_notification_url" VARCHAR(255) NOT NULL,
    "transaction_initiated" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "transaction_finished" TIMESTAMPTZ(6),
    "account_id" UUID NOT NULL,
    "contract_id" UUID NOT NULL,
    "terminal_id" UUID NOT NULL,
    "installment_id" UUID,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "user_has_accounts" (
    "user_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,

    CONSTRAINT "user_has_accounts_pkey" PRIMARY KEY ("user_id","account_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_last_modified" TIMESTAMPTZ(6),
    "user_first_name" VARCHAR(255),
    "user_last_name" VARCHAR(255),
    "user_birth_date" VARCHAR(255),
    "user_birth_city" VARCHAR(255),
    "user_birth_country" VARCHAR(255),
    "user_phone" VARCHAR(255),
    "user_email" VARCHAR(255),
    "user_role" VARCHAR(255) NOT NULL,
    "creator_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("partner_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billing_addresses" ADD CONSTRAINT "billing_addresses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_terminal_id_fkey" FOREIGN KEY ("terminal_id") REFERENCES "terminals"("terminal_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "installments" ADD CONSTRAINT "installments_terminal_id_fkey" FOREIGN KEY ("terminal_id") REFERENCES "terminals"("terminal_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "terminals" ADD CONSTRAINT "terminals_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "installments"("installment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_terminal_id_fkey" FOREIGN KEY ("terminal_id") REFERENCES "terminals"("terminal_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_has_accounts" ADD CONSTRAINT "user_has_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("account_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_has_accounts" ADD CONSTRAINT "user_has_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
