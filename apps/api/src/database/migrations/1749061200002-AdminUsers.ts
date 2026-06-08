import { MigrationInterface, QueryRunner } from 'typeorm';

/** Dev/staging seed password: changeme — rotate on production deploy. */
const SEED_ADMIN_HASH =
  '$2b$10$tuRdtccHd.mzneznE5OpT.j/3Ip6JtFwN.dTlc6DYJ8ZojosCmMHe';

export class AdminUsers1749061200002 implements MigrationInterface {
  name = 'AdminUsers1749061200002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying(320) NOT NULL,
        "password_hash" character varying(255) NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      INSERT INTO "users" ("email", "password_hash", "role")
      VALUES ('admin@wzrusz.local', '${SEED_ADMIN_HASH}', 'admin')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
