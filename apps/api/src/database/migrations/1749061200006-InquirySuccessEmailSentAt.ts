import { MigrationInterface, QueryRunner } from 'typeorm';

export class InquirySuccessEmailSentAt1749061200006 implements MigrationInterface {
  name = 'InquirySuccessEmailSentAt1749061200006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inquiries" ADD COLUMN "success_email_sent_at" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inquiries" DROP COLUMN "success_email_sent_at"`,
    );
  }
}
