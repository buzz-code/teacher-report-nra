import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStudentTeacherRelationship1757320329886 implements MigrationInterface {
    name = 'UpdateStudentTeacherRelationship1757320329886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP COLUMN \`student_count\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`teacherTz\` varchar(9) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`teacherReferenceId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`start_date\` date NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`end_date\` date NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`students_end_date_idx\` ON \`students\` (\`end_date\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`students_start_date_idx\` ON \`students\` (\`start_date\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`students_teacher_id_idx\` ON \`students\` (\`teacherReferenceId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD CONSTRAINT \`FK_f09563194f8f2e47e23b913f98e\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_f09563194f8f2e47e23b913f98e\`
        `);
        await queryRunner.query(`
            DROP INDEX \`students_teacher_id_idx\` ON \`students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`students_start_date_idx\` ON \`students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`students_end_date_idx\` ON \`students\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`end_date\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`start_date\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`teacherReferenceId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`teacherTz\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD \`student_count\` int NULL
        `);
    }

}
