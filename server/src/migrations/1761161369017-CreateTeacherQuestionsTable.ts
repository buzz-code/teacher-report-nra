import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeacherQuestionsTable1761161369017 implements MigrationInterface {
  name = 'CreateTeacherQuestionsTable1761161369017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`teacher_questions\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`teacherReferenceId\` int NOT NULL,
                \`questionReferenceId\` int NOT NULL,
                \`answerReferenceId\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`user_id\` int NULL,
                \`teacher_reference_id\` int NULL,
                \`question_reference_id\` int NULL,
                \`answer_reference_id\` int NULL,
                INDEX \`IDX_0637edfbbe14935cc927203d76\` (\`answerReferenceId\`),
                INDEX \`IDX_5bfbedeac97b2c55124bd7bdba\` (\`questionReferenceId\`),
                INDEX \`IDX_58a92d14ccffe8e6c7d89efebc\` (\`teacherReferenceId\`),
                INDEX \`IDX_59d9dcb64a0efa4e6dcebaa549\` (\`userId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`IDX_59d9dcb64a0efa4e6dcebaa549\` ON \`teacher_questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_58a92d14ccffe8e6c7d89efebc\` ON \`teacher_questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_5bfbedeac97b2c55124bd7bdba\` ON \`teacher_questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_0637edfbbe14935cc927203d76\` ON \`teacher_questions\`
        `);
    await queryRunner.query(`
            DROP TABLE \`teacher_questions\`
        `);
  }
}
