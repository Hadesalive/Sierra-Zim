import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_page_hero_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"accent" varchar,
  	"rest" varchar
  );
  
  ALTER TABLE "home" ADD COLUMN "proof_rail_heading" varchar;
  ALTER TABLE "home" ADD COLUMN "proof_rail_intro" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "whatsapp_note" varchar;
  ALTER TABLE "services_page_hero_specs" ADD CONSTRAINT "services_page_hero_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_page_hero_specs_order_idx" ON "services_page_hero_specs" USING btree ("_order");
  CREATE INDEX "services_page_hero_specs_parent_id_idx" ON "services_page_hero_specs" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_page_hero_specs" CASCADE;
  ALTER TABLE "home" DROP COLUMN "proof_rail_heading";
  ALTER TABLE "home" DROP COLUMN "proof_rail_intro";
  ALTER TABLE "contact_page" DROP COLUMN "whatsapp_note";`)
}
