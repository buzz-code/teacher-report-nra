import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanTeacherQuestionDuplicateFields1761555282168 implements MigrationInterface {
  name = 'CleanTeacherQuestionDuplicateFields1761555282168';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`teacher_questions\` DROP COLUMN \`teacher_reference_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teacher_questions\` DROP COLUMN \`question_reference_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teacher_questions\` DROP COLUMN \`answer_reference_id\`
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`teacher_questions\`
            ADD \`answer_reference_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`teacher_questions\`
            ADD \`question_reference_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`teacher_questions\`
            ADD \`teacher_reference_id\` int NULL
        `);
  }
}
