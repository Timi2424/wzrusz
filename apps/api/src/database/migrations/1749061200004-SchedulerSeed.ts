import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchedulerSeed1749061200004 implements MigrationInterface {
  name = 'SchedulerSeed1749061200004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "schedule_events" ("title", "starts_at", "ends_at")
      VALUES
        (
          'Wesele Kowalscy',
          '2026-07-15T10:00:00+02:00',
          '2026-07-16T18:00:00+02:00'
        ),
        (
          'Konferencja Tech Summit',
          '2026-08-01T08:00:00+02:00',
          '2026-08-01T20:00:00+02:00'
        )
    `);

    await queryRunner.query(`
      INSERT INTO "schedule_event_line_items" (
        "schedule_event_id",
        "decoration_id",
        "quantity"
      )
      VALUES
        (
          (SELECT "id" FROM "schedule_events" WHERE "title" = 'Wesele Kowalscy' LIMIT 1),
          (SELECT "id" FROM "decorations" WHERE "slug" = 'girlanda-balonow-pastel' LIMIT 1),
          2
        ),
        (
          (SELECT "id" FROM "schedule_events" WHERE "title" = 'Wesele Kowalscy' LIMIT 1),
          (SELECT "id" FROM "decorations" WHERE "slug" = 'luk-balonowy-klasyczny' LIMIT 1),
          1
        ),
        (
          (SELECT "id" FROM "schedule_events" WHERE "title" = 'Konferencja Tech Summit' LIMIT 1),
          (SELECT "id" FROM "decorations" WHERE "slug" = 'girlanda-swietlna-ciepla' LIMIT 1),
          4
        ),
        (
          (SELECT "id" FROM "schedule_events" WHERE "title" = 'Konferencja Tech Summit' LIMIT 1),
          (SELECT "id" FROM "decorations" WHERE "slug" = 'lampki-stolowe-szklane' LIMIT 1),
          6
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "schedule_event_line_items"
      WHERE "schedule_event_id" IN (
        SELECT "id" FROM "schedule_events"
        WHERE "title" IN ('Wesele Kowalscy', 'Konferencja Tech Summit')
      )
    `);
    await queryRunner.query(`
      DELETE FROM "schedule_events"
      WHERE "title" IN ('Wesele Kowalscy', 'Konferencja Tech Summit')
    `);
  }
}
