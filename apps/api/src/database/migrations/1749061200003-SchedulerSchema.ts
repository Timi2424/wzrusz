import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchedulerSchema1749061200003 implements MigrationInterface {
  name = 'SchedulerSchema1749061200003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "schedule_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(200) NOT NULL,
        "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "inquiry_id" uuid,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_schedule_events" PRIMARY KEY ("id"),
        CONSTRAINT "FK_schedule_events_inquiry" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_schedule_events_starts_at" ON "schedule_events" ("starts_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_schedule_events_ends_at" ON "schedule_events" ("ends_at")`,
    );
    await queryRunner.query(`
      CREATE TABLE "schedule_event_line_items" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "schedule_event_id" uuid NOT NULL,
        "decoration_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        CONSTRAINT "PK_schedule_event_line_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_schedule_event_line_items_event" FOREIGN KEY ("schedule_event_id") REFERENCES "schedule_events"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_schedule_event_line_items_decoration" FOREIGN KEY ("decoration_id") REFERENCES "decorations"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_schedule_event_line_items_event_id" ON "schedule_event_line_items" ("schedule_event_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_schedule_event_line_items_decoration_id" ON "schedule_event_line_items" ("decoration_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "schedule_event_line_items"`);
    await queryRunner.query(`DROP TABLE "schedule_events"`);
  }
}
