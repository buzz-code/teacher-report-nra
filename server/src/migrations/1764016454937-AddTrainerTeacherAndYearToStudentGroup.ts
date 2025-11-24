import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrainerTeacherAndYearToStudentGroup1764016454937 implements MigrationInterface {
    name = 'AddTrainerTeacherAndYearToStudentGroup1764016454937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_groups\`
            ADD \`year\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_groups\`
            ADD \`training_teacher\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_groups\` DROP COLUMN \`training_teacher\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_groups\` DROP COLUMN \`year\`
        `);
    }

}
