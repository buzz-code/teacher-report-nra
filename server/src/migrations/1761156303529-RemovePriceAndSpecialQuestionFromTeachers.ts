import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePriceAndSpecialQuestionFromTeachers1761156303529 implements MigrationInterface {
    name = 'RemovePriceAndSpecialQuestionFromTeachers1761156303529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP COLUMN \`price\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP COLUMN \`special_question\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD \`special_question\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD \`price\` decimal(8, 2) NULL
        `);
    }

}
