import { MigrationInterface, QueryRunner } from 'typeorm';

export class CatalogSeed1749061200001 implements MigrationInterface {
  name = 'CatalogSeed1749061200001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "categories" ("name", "slug", "sort_order")
      VALUES
        ('Balony i girlandy', 'balony-i-girlandy', 1),
        ('Stoły i nakrycia', 'stoly-i-nakrycia', 2),
        ('Oświetlenie dekoracyjne', 'oswietlenie', 3),
        ('Dodatki tematyczne', 'dodatki-tematyczne', 4)
    `);

    await queryRunner.query(`
      INSERT INTO "decorations" (
        "category_id",
        "name",
        "slug",
        "description",
        "image_url",
        "stock_quantity"
      )
      VALUES
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'balony-i-girlandy'),
          'Girlanda z balonów pastel',
          'girlanda-balonow-pastel',
          'Miękka girlanda w pastelowych odcieniach — idealna nad stół prezydialny lub candy bar.',
          NULL,
          6
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'balony-i-girlandy'),
          'Łuk balonowy klasyczny',
          'luk-balonowy-klasyczny',
          'Łuk z balonów lateksowych w kolorach marki; wymiary ustalane pod lokalizację eventu.',
          NULL,
          2
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'stoly-i-nakrycia'),
          'Runner lniany naturalny',
          'runner-lniany-naturalny',
          'Lniany bieżnik na stół — neutralna baza pod dekoracje kwiatowe i świece.',
          NULL,
          18
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'stoly-i-nakrycia'),
          'Zestaw serwet i obrusów kremowych',
          'zestaw-serwet-obrusow-kremowych',
          'Komplet obrusów i serwet w odcieniu kremu z palety Wzrusz; pakiet na stół 10-osobowy.',
          NULL,
          5
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'oswietlenie'),
          'Girlanda świetlna ciepła',
          'girlanda-swietlna-ciepla',
          'Ciepłe światło LED na baterie — do wieszania na ścianie, balustradzie lub drzewie.',
          NULL,
          12
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'oswietlenie'),
          'Lampki stołowe szklane',
          'lampki-stolowe-szklane',
          'Para dekoracyjnych lampek szklanych ze świecami LED; na stół gości lub strefę foto.',
          NULL,
          8
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'dodatki-tematyczne'),
          'Tablica powitalna personalizowana',
          'tablica-powitalna',
          'Drewniana tablica z miejscem na napis — personalizacja po ustaleniu w zapytaniu.',
          NULL,
          3
        ),
        (
          (SELECT "id" FROM "categories" WHERE "slug" = 'dodatki-tematyczne'),
          'Stojak na plan stołów',
          'stojak-plan-stolow',
          'Stojak z ramą na plan rozsadzenia gości; format A2, w kolorze naturalnego drewna.',
          NULL,
          1
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "decorations"`);
    await queryRunner.query(`DELETE FROM "categories"`);
  }
}
