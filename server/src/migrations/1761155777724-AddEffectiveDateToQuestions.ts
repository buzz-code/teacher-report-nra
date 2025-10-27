import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEffectiveDateToQuestions1761155777724 implements MigrationInterface {
  name = 'AddEffectiveDateToQuestions1761155777724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`effective_date\` date NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`effective_date\`
        `);
  }
}
