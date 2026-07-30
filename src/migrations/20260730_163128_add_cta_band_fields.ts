import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_gallery_category" AS ENUM('classroom', 'light-vehicle', 'heavy-equipment', 'simulator', 'certification', 'projects', 'testimonials');
  CREATE TYPE "public"."enum_home_cta_secondary" AS ENUM('phone', 'whatsapp', 'none');
  CREATE TYPE "public"."enum_about_page_cta_secondary" AS ENUM('phone', 'whatsapp', 'none');
  CREATE TYPE "public"."enum_services_page_cta_secondary" AS ENUM('phone', 'whatsapp', 'none');
  CREATE TYPE "public"."enum_portfolio_page_cta_secondary" AS ENUM('phone', 'whatsapp', 'none');
  CREATE TYPE "public"."enum_gallery_page_cta_secondary" AS ENUM('phone', 'whatsapp', 'none');
  CREATE TYPE "public"."enum_sectors_page_cta_secondary" AS ENUM('phone', 'whatsapp', 'none');
  ALTER TABLE "gallery" ADD COLUMN "category" "enum_gallery_category";
  ALTER TABLE "site_leadership" ADD COLUMN "photo_id" integer;
  ALTER TABLE "home" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "home" ADD COLUMN "why_us_image_id" integer;
  ALTER TABLE "home" ADD COLUMN "cta_title_top" varchar;
  ALTER TABLE "home" ADD COLUMN "cta_title_bottom" varchar;
  ALTER TABLE "home" ADD COLUMN "cta_intro" varchar;
  ALTER TABLE "home" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "home" ADD COLUMN "cta_secondary" "enum_home_cta_secondary" DEFAULT 'phone';
  ALTER TABLE "about_page" ADD COLUMN "cta_title_top" varchar;
  ALTER TABLE "about_page" ADD COLUMN "cta_title_bottom" varchar;
  ALTER TABLE "about_page" ADD COLUMN "cta_intro" varchar;
  ALTER TABLE "about_page" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "about_page" ADD COLUMN "cta_secondary" "enum_about_page_cta_secondary" DEFAULT 'phone';
  ALTER TABLE "services_page" ADD COLUMN "cta_title_top" varchar;
  ALTER TABLE "services_page" ADD COLUMN "cta_title_bottom" varchar;
  ALTER TABLE "services_page" ADD COLUMN "cta_intro" varchar;
  ALTER TABLE "services_page" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "services_page" ADD COLUMN "cta_secondary" "enum_services_page_cta_secondary" DEFAULT 'phone';
  ALTER TABLE "portfolio_page" ADD COLUMN "cta_title_top" varchar;
  ALTER TABLE "portfolio_page" ADD COLUMN "cta_title_bottom" varchar;
  ALTER TABLE "portfolio_page" ADD COLUMN "cta_intro" varchar;
  ALTER TABLE "portfolio_page" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "portfolio_page" ADD COLUMN "cta_secondary" "enum_portfolio_page_cta_secondary" DEFAULT 'phone';
  ALTER TABLE "gallery_page" ADD COLUMN "cta_title_top" varchar;
  ALTER TABLE "gallery_page" ADD COLUMN "cta_title_bottom" varchar;
  ALTER TABLE "gallery_page" ADD COLUMN "cta_intro" varchar;
  ALTER TABLE "gallery_page" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "gallery_page" ADD COLUMN "cta_secondary" "enum_gallery_page_cta_secondary" DEFAULT 'phone';
  ALTER TABLE "sectors_page" ADD COLUMN "cta_title_top" varchar;
  ALTER TABLE "sectors_page" ADD COLUMN "cta_title_bottom" varchar;
  ALTER TABLE "sectors_page" ADD COLUMN "cta_intro" varchar;
  ALTER TABLE "sectors_page" ADD COLUMN "cta_primary_label" varchar;
  ALTER TABLE "sectors_page" ADD COLUMN "cta_secondary" "enum_sectors_page_cta_secondary" DEFAULT 'phone';
  ALTER TABLE "site_leadership" ADD CONSTRAINT "site_leadership_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_why_us_image_id_media_id_fk" FOREIGN KEY ("why_us_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_leadership_photo_idx" ON "site_leadership" USING btree ("photo_id");
  CREATE INDEX "home_hero_image_idx" ON "home" USING btree ("hero_image_id");
  CREATE INDEX "home_why_us_image_idx" ON "home" USING btree ("why_us_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_leadership" DROP CONSTRAINT "site_leadership_photo_id_media_id_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_hero_image_id_media_id_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_why_us_image_id_media_id_fk";
  
  DROP INDEX "site_leadership_photo_idx";
  DROP INDEX "home_hero_image_idx";
  DROP INDEX "home_why_us_image_idx";
  ALTER TABLE "gallery" DROP COLUMN "category";
  ALTER TABLE "site_leadership" DROP COLUMN "photo_id";
  ALTER TABLE "home" DROP COLUMN "hero_image_id";
  ALTER TABLE "home" DROP COLUMN "why_us_image_id";
  ALTER TABLE "home" DROP COLUMN "cta_title_top";
  ALTER TABLE "home" DROP COLUMN "cta_title_bottom";
  ALTER TABLE "home" DROP COLUMN "cta_intro";
  ALTER TABLE "home" DROP COLUMN "cta_primary_label";
  ALTER TABLE "home" DROP COLUMN "cta_secondary";
  ALTER TABLE "about_page" DROP COLUMN "cta_title_top";
  ALTER TABLE "about_page" DROP COLUMN "cta_title_bottom";
  ALTER TABLE "about_page" DROP COLUMN "cta_intro";
  ALTER TABLE "about_page" DROP COLUMN "cta_primary_label";
  ALTER TABLE "about_page" DROP COLUMN "cta_secondary";
  ALTER TABLE "services_page" DROP COLUMN "cta_title_top";
  ALTER TABLE "services_page" DROP COLUMN "cta_title_bottom";
  ALTER TABLE "services_page" DROP COLUMN "cta_intro";
  ALTER TABLE "services_page" DROP COLUMN "cta_primary_label";
  ALTER TABLE "services_page" DROP COLUMN "cta_secondary";
  ALTER TABLE "portfolio_page" DROP COLUMN "cta_title_top";
  ALTER TABLE "portfolio_page" DROP COLUMN "cta_title_bottom";
  ALTER TABLE "portfolio_page" DROP COLUMN "cta_intro";
  ALTER TABLE "portfolio_page" DROP COLUMN "cta_primary_label";
  ALTER TABLE "portfolio_page" DROP COLUMN "cta_secondary";
  ALTER TABLE "gallery_page" DROP COLUMN "cta_title_top";
  ALTER TABLE "gallery_page" DROP COLUMN "cta_title_bottom";
  ALTER TABLE "gallery_page" DROP COLUMN "cta_intro";
  ALTER TABLE "gallery_page" DROP COLUMN "cta_primary_label";
  ALTER TABLE "gallery_page" DROP COLUMN "cta_secondary";
  ALTER TABLE "sectors_page" DROP COLUMN "cta_title_top";
  ALTER TABLE "sectors_page" DROP COLUMN "cta_title_bottom";
  ALTER TABLE "sectors_page" DROP COLUMN "cta_intro";
  ALTER TABLE "sectors_page" DROP COLUMN "cta_primary_label";
  ALTER TABLE "sectors_page" DROP COLUMN "cta_secondary";
  DROP TYPE "public"."enum_gallery_category";
  DROP TYPE "public"."enum_home_cta_secondary";
  DROP TYPE "public"."enum_about_page_cta_secondary";
  DROP TYPE "public"."enum_services_page_cta_secondary";
  DROP TYPE "public"."enum_portfolio_page_cta_secondary";
  DROP TYPE "public"."enum_gallery_page_cta_secondary";
  DROP TYPE "public"."enum_sectors_page_cta_secondary";`)
}
