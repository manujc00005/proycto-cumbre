/*
  Warnings:

  - The `status` column on the `event_registrations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'confirmed', 'cancelled', 'attended', 'no_show');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- DropIndex
DROP INDEX "products_category_idx";

-- AlterTable
ALTER TABLE "event_registrations" ADD COLUMN     "ip_address" VARCHAR(45),
ADD COLUMN     "shirt_size" VARCHAR(10),
DROP COLUMN "status",
ADD COLUMN     "status" "RegistrationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discount_code_id" UUID,
ADD COLUMN     "ip_address" VARCHAR(45),
ADD COLUMN     "marketing_consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "marketing_consent_at" TIMESTAMP(3),
ADD COLUMN     "marketing_revoked_at" TIMESTAMP(3),
ADD COLUMN     "shipping_address_id" UUID;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "parent_id" UUID,
    "image_url" VARCHAR(500),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "product_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("product_id","category_id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" UUID NOT NULL,
    "session_id" VARCHAR(255),
    "member_id" UUID,
    "guest_email" VARCHAR(255),
    "marketing_consent" BOOLEAN,
    "marketing_consent_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" UUID NOT NULL,
    "cart_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_data" JSONB,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_codes" (
    "id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "min_purchase" INTEGER,
    "max_discount" INTEGER,
    "valid_from" TIMESTAMP(3),
    "valid_until" TIMESTAMP(3),
    "max_uses" INTEGER,
    "max_uses_per_user" INTEGER DEFAULT 1,
    "current_uses" INTEGER NOT NULL DEFAULT 0,
    "applicable_to" JSONB,
    "members_only" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_reservations" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "variant_id" VARCHAR(100),
    "quantity" INTEGER NOT NULL,
    "cart_id" UUID,
    "order_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_addresses" (
    "id" UUID NOT NULL,
    "member_id" UUID,
    "guest_email" VARCHAR(255),
    "label" VARCHAR(100),
    "recipient_name" VARCHAR(255) NOT NULL,
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "province" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(10) NOT NULL,
    "country" VARCHAR(2) NOT NULL DEFAULT 'ES',
    "phone" VARCHAR(20) NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "order_id" UUID,
    "member_id" UUID,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(255),
    "comment" TEXT,
    "verified_purchase" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "helpful_count" INTEGER NOT NULL DEFAULT 0,
    "not_helpful_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_status_idx" ON "categories"("status");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "categories"("sort_order");

-- CreateIndex
CREATE INDEX "product_categories_product_id_idx" ON "product_categories"("product_id");

-- CreateIndex
CREATE INDEX "product_categories_category_id_idx" ON "product_categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_session_id_key" ON "carts"("session_id");

-- CreateIndex
CREATE INDEX "carts_session_id_idx" ON "carts"("session_id");

-- CreateIndex
CREATE INDEX "carts_member_id_idx" ON "carts"("member_id");

-- CreateIndex
CREATE INDEX "carts_guest_email_idx" ON "carts"("guest_email");

-- CreateIndex
CREATE INDEX "carts_expires_at_idx" ON "carts"("expires_at");

-- CreateIndex
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "cart_items_product_id_idx" ON "cart_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "discount_codes_code_key" ON "discount_codes"("code");

-- CreateIndex
CREATE INDEX "discount_codes_code_idx" ON "discount_codes"("code");

-- CreateIndex
CREATE INDEX "discount_codes_status_idx" ON "discount_codes"("status");

-- CreateIndex
CREATE INDEX "discount_codes_valid_until_idx" ON "discount_codes"("valid_until");

-- CreateIndex
CREATE INDEX "stock_reservations_product_id_idx" ON "stock_reservations"("product_id");

-- CreateIndex
CREATE INDEX "stock_reservations_cart_id_idx" ON "stock_reservations"("cart_id");

-- CreateIndex
CREATE INDEX "stock_reservations_order_id_idx" ON "stock_reservations"("order_id");

-- CreateIndex
CREATE INDEX "stock_reservations_expires_at_idx" ON "stock_reservations"("expires_at");

-- CreateIndex
CREATE INDEX "stock_reservations_status_idx" ON "stock_reservations"("status");

-- CreateIndex
CREATE INDEX "shipping_addresses_member_id_idx" ON "shipping_addresses"("member_id");

-- CreateIndex
CREATE INDEX "shipping_addresses_guest_email_idx" ON "shipping_addresses"("guest_email");

-- CreateIndex
CREATE INDEX "product_reviews_product_id_idx" ON "product_reviews"("product_id");

-- CreateIndex
CREATE INDEX "product_reviews_member_id_idx" ON "product_reviews"("member_id");

-- CreateIndex
CREATE INDEX "product_reviews_status_idx" ON "product_reviews"("status");

-- CreateIndex
CREATE INDEX "product_reviews_rating_idx" ON "product_reviews"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "product_reviews_order_id_product_id_key" ON "product_reviews"("order_id", "product_id");

-- CreateIndex
CREATE INDEX "event_registrations_status_idx" ON "event_registrations"("status");

-- CreateIndex
CREATE INDEX "orders_marketing_consent_idx" ON "orders"("marketing_consent");

-- CreateIndex
CREATE INDEX "orders_discount_code_id_idx" ON "orders"("discount_code_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_code_id_fkey" FOREIGN KEY ("discount_code_id") REFERENCES "discount_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_reservations" ADD CONSTRAINT "stock_reservations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
