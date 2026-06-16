import { MigrationInterface, QueryRunner } from 'typeorm';

export class InquiryApprovedStatus1749061200005 implements MigrationInterface {
  name = 'InquiryApprovedStatus1749061200005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."inquiries_status_enum" ADD VALUE IF NOT EXISTS 'approved'`,
    );
  }

  public async down(): Promise<void> {
    // PostgreSQL does not support removing enum values safely.
  }
}
