-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('M', 'F', 'O');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('none', 'a', 'a_plus', 'a_nac', 'a_nac_plus', 'b', 'b_plus', 'c');

-- CreateEnum
CREATE TYPE "FedmeStatus" AS ENUM ('none', 'pending', 'processing', 'active', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('pending', 'active', 'expired', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('membership', 'event', 'order', 'license_renewal');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('draft', 'published', 'sold_out', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');

-- CreateTable
CREATE TABLE "headquarters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "membership_prices" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "headquarters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL,
    "headquarters_id" UUID,
    "member_number" VARCHAR(50),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "birth_date" DATE NOT NULL,
    "dni" VARCHAR(20),
    "sex" "Sex" NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "emergency_phone" VARCHAR(20),
    "emergency_contact_name" VARCHAR(255),
    "province" VARCHAR(100) NOT NULL,
    "city" VARCHAR(100),
    "address" TEXT NOT NULL,
    "postal_code" VARCHAR(10),
    "shirt_size" VARCHAR(10),
    "hoodie_size" VARCHAR(10),
    "pants_size" VARCHAR(10),
    "license_type" "LicenseType" NOT NULL,
    "fedme_license_number" VARCHAR(50),
    "fedme_status" "FedmeStatus" NOT NULL DEFAULT 'pending',
    "membership_status" "MembershipStatus" NOT NULL DEFAULT 'pending',
    "membership_start_date" DATE,
    "membership_end_date" DATE,
    "privacy_accepted" BOOLEAN NOT NULL DEFAULT true,
    "privacy_accepted_at" TIMESTAMP(3),
    "privacy_accepted_ip" VARCHAR(45),
    "privacy_policy_version" VARCHAR(20) DEFAULT '1.0',
    "marketing_consent" BOOLEAN NOT NULL DEFAULT true,
    "marketing_consent_at" TIMESTAMP(3),
    "marketing_revoked_at" TIMESTAMP(3),
    "whatsapp_consent" BOOLEAN NOT NULL DEFAULT true,
    "whatsapp_consent_at" TIMESTAMP(3),
    "whatsapp_revoked_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(3) NOT NULL,
    "location" VARCHAR(255),
    "max_participants" INTEGER,
    "current_participants" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'eur',
    "requires_member" BOOLEAN NOT NULL DEFAULT false,
    "member_discount" INTEGER NOT NULL DEFAULT 0,
    "custom_fields" JSONB,
    "whatsapp_group" VARCHAR(500),
    "status" "EventStatus" NOT NULL DEFAULT 'draft',
    "image_url" VARCHAR(500),
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_registrations" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "member_id" UUID,
    "participant_name" VARCHAR(255) NOT NULL,
    "participant_email" VARCHAR(255) NOT NULL,
    "participant_phone" VARCHAR(20) NOT NULL,
    "custom_data" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "privacy_accepted" BOOLEAN NOT NULL DEFAULT false,
    "privacy_accepted_at" TIMESTAMP(3),
    "privacy_policy_version" VARCHAR(20) DEFAULT '1.0',
    "whatsapp_consent" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp_consent_at" TIMESTAMP(3),
    "marketing_consent" BOOLEAN NOT NULL DEFAULT false,
    "marketing_consent_at" TIMESTAMP(3),
    "marketing_revoked_at" TIMESTAMP(3),
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "compare_at_price" INTEGER,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'eur',
    "stock" INTEGER NOT NULL DEFAULT 0,
    "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
    "track_inventory" BOOLEAN NOT NULL DEFAULT true,
    "has_variants" BOOLEAN NOT NULL DEFAULT false,
    "variants" JSONB,
    "category" VARCHAR(100),
    "tags" TEXT[],
    "images" JSONB,
    "meta_title" VARCHAR(255),
    "meta_description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "order_number" VARCHAR(50) NOT NULL,
    "member_id" UUID,
    "customer_email" VARCHAR(255) NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "customer_phone" VARCHAR(20),
    "shipping_address" JSONB NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "shipping_cost" INTEGER NOT NULL DEFAULT 0,
    "tax" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'eur',
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "tracking_number" VARCHAR(255),
    "shipped_at" TIMESTAMP(3),
    "delivered_at" TIMESTAMP(3),
    "customer_notes" TEXT,
    "admin_notes" TEXT,
    "privacy_policy_version" VARCHAR(20) DEFAULT '1.0',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "product_id" UUID,
    "product_name" VARCHAR(255) NOT NULL,
    "product_slug" VARCHAR(100),
    "variant_data" JSONB,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "payment_type" "PaymentType" NOT NULL,
    "member_id" UUID,
    "event_registration_id" UUID,
    "order_id" UUID,
    "stripe_session_id" VARCHAR(255) NOT NULL,
    "stripe_payment_id" VARCHAR(255),
    "amount" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'eur',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waiver_acceptances" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "waiver_version" VARCHAR(50) NOT NULL,
    "participant_full_name" VARCHAR(255) NOT NULL,
    "participant_document_id" VARCHAR(50) NOT NULL,
    "participant_birth_date" DATE,
    "waiver_text_hash" VARCHAR(64) NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL,
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "event_registration_id" UUID,
    "member_id" UUID,

    CONSTRAINT "waiver_acceptances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "headquarters_code_key" ON "headquarters"("code");

-- CreateIndex
CREATE INDEX "headquarters_code_idx" ON "headquarters"("code");

-- CreateIndex
CREATE INDEX "headquarters_status_idx" ON "headquarters"("status");

-- CreateIndex
CREATE UNIQUE INDEX "members_member_number_key" ON "members"("member_number");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "members_fedme_license_number_key" ON "members"("fedme_license_number");

-- CreateIndex
CREATE INDEX "members_headquarters_id_idx" ON "members"("headquarters_id");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_dni_idx" ON "members"("dni");

-- CreateIndex
CREATE INDEX "members_membership_status_idx" ON "members"("membership_status");

-- CreateIndex
CREATE INDEX "members_member_number_idx" ON "members"("member_number");

-- CreateIndex
CREATE INDEX "members_created_at_idx" ON "members"("created_at" DESC);

-- CreateIndex
CREATE INDEX "members_privacy_accepted_idx" ON "members"("privacy_accepted");

-- CreateIndex
CREATE INDEX "members_marketing_consent_idx" ON "members"("marketing_consent");

-- CreateIndex
CREATE INDEX "members_deleted_at_idx" ON "members"("deleted_at");

-- CreateIndex
CREATE INDEX "members_privacy_policy_version_idx" ON "members"("privacy_policy_version");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_event_date_idx" ON "events"("event_date");

-- CreateIndex
CREATE INDEX "event_registrations_event_id_idx" ON "event_registrations"("event_id");

-- CreateIndex
CREATE INDEX "event_registrations_member_id_idx" ON "event_registrations"("member_id");

-- CreateIndex
CREATE INDEX "event_registrations_participant_email_idx" ON "event_registrations"("participant_email");

-- CreateIndex
CREATE INDEX "event_registrations_status_idx" ON "event_registrations"("status");

-- CreateIndex
CREATE INDEX "event_registrations_privacy_accepted_idx" ON "event_registrations"("privacy_accepted");

-- CreateIndex
CREATE INDEX "event_registrations_privacy_policy_version_idx" ON "event_registrations"("privacy_policy_version");

-- CreateIndex
CREATE INDEX "event_registrations_marketing_consent_idx" ON "event_registrations"("marketing_consent");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_slug_idx" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_status_idx" ON "products"("status");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "products_featured_idx" ON "products"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_order_number_idx" ON "orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_member_id_idx" ON "orders"("member_id");

-- CreateIndex
CREATE INDEX "orders_customer_email_idx" ON "orders"("customer_email");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_created_at_idx" ON "orders"("created_at" DESC);

-- CreateIndex
CREATE INDEX "orders_privacy_policy_version_idx" ON "orders"("privacy_policy_version");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_product_id_idx" ON "order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_event_registration_id_key" ON "payments"("event_registration_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripe_session_id_key" ON "payments"("stripe_session_id");

-- CreateIndex
CREATE INDEX "payments_payment_type_idx" ON "payments"("payment_type");

-- CreateIndex
CREATE INDEX "payments_member_id_idx" ON "payments"("member_id");

-- CreateIndex
CREATE INDEX "payments_event_registration_id_idx" ON "payments"("event_registration_id");

-- CreateIndex
CREATE INDEX "payments_order_id_idx" ON "payments"("order_id");

-- CreateIndex
CREATE INDEX "payments_stripe_session_id_idx" ON "payments"("stripe_session_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_created_at_idx" ON "payments"("created_at" DESC);

-- CreateIndex
CREATE INDEX "waiver_acceptances_event_id_idx" ON "waiver_acceptances"("event_id");

-- CreateIndex
CREATE INDEX "waiver_acceptances_participant_document_id_idx" ON "waiver_acceptances"("participant_document_id");

-- CreateIndex
CREATE INDEX "waiver_acceptances_waiver_version_idx" ON "waiver_acceptances"("waiver_version");

-- CreateIndex
CREATE INDEX "waiver_acceptances_event_registration_id_idx" ON "waiver_acceptances"("event_registration_id");

-- CreateIndex
CREATE INDEX "waiver_acceptances_member_id_idx" ON "waiver_acceptances"("member_id");

-- CreateIndex
CREATE INDEX "waiver_acceptances_accepted_at_idx" ON "waiver_acceptances"("accepted_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "waiver_acceptances_event_id_participant_document_id_waiver__key" ON "waiver_acceptances"("event_id", "participant_document_id", "waiver_version");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_headquarters_id_fkey" FOREIGN KEY ("headquarters_id") REFERENCES "headquarters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_event_registration_id_fkey" FOREIGN KEY ("event_registration_id") REFERENCES "event_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waiver_acceptances" ADD CONSTRAINT "waiver_acceptances_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waiver_acceptances" ADD CONSTRAINT "waiver_acceptances_event_registration_id_fkey" FOREIGN KEY ("event_registration_id") REFERENCES "event_registrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waiver_acceptances" ADD CONSTRAINT "waiver_acceptances_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

