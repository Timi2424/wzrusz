import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1749061200000 implements MigrationInterface {
  name = 'InitialSchema1749061200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."inquiries_status_enum" AS ENUM('submitted')`,
    );
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(120) NOT NULL,
        "slug" character varying(120) NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_categories_slug" UNIQUE ("slug")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "decorations" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "category_id" uuid NOT NULL,
        "name" character varying(160) NOT NULL,
        "slug" character varying(160) NOT NULL,
        "description" text NOT NULL DEFAULT '',
        "image_url" character varying(512),
        "stock_quantity" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_decorations" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_decorations_slug" UNIQUE ("slug"),
        CONSTRAINT "FK_decorations_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_decorations_category_id" ON "decorations" ("category_id")`,
    );
    await queryRunner.query(`
      CREATE TABLE "inquiries" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "full_name" character varying(200) NOT NULL,
        "email" character varying(320) NOT NULL,
        "phone" character varying(40),
        "event_start" TIMESTAMP WITH TIME ZONE NOT NULL,
        "event_end" TIMESTAMP WITH TIME ZONE NOT NULL,
        "transport_address" text NOT NULL,
        "needs_invoice" boolean NOT NULL DEFAULT false,
        "invoice_notes" text,
        "status" "public"."inquiries_status_enum" NOT NULL DEFAULT 'submitted',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inquiries" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_inquiries_created_at" ON "inquiries" ("created_at")`,
    );
    await queryRunner.query(`
      CREATE TABLE "inquiry_line_items" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "inquiry_id" uuid NOT NULL,
        "decoration_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "sort_order" integer NOT NULL DEFAULT 0,
        CONSTRAINT "PK_inquiry_line_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inquiry_line_items_inquiry" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_inquiry_line_items_decoration" FOREIGN KEY ("decoration_id") REFERENCES "decorations"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_inquiry_line_items_inquiry_id" ON "inquiry_line_items" ("inquiry_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inquiry_line_items_decoration_id" ON "inquiry_line_items" ("decoration_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inquiry_line_items"`);
    await queryRunner.query(`DROP TABLE "inquiries"`);
    await queryRunner.query(`DROP TABLE "decorations"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TYPE "public"."inquiries_status_enum"`);
  }
}
