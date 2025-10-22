import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTeacherTypeFromQuestions1761163340210 implements MigrationInterface {
    name = 'RemoveTeacherTypeFromQuestions1761163340210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_ffb08405d93905accfe8bfe138f\`
        `);
        await queryRunner.query(`
            DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeKey\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeReferenceId\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`teacherTypeReferenceId\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`teacherTypeKey\` int NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacherTypeReferenceId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD CONSTRAINT \`FK_ffb08405d93905accfe8bfe138f\` FOREIGN KEY (\`teacherTypeReferenceId\`) REFERENCES \`teacher_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
