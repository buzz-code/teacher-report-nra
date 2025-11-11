import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceStudentWithStudentGroup1762883018027 implements MigrationInterface {
    name = 'ReplaceStudentWithStudentGroup1762883018027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`student_groups\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`teacherTz\` varchar(9) NULL,
                \`teacherReferenceId\` int NULL,
                \`start_date\` date NOT NULL,
                \`end_date\` date NULL,
                \`student_count\` int NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`student_groups_end_date_idx\` (\`end_date\`),
                INDEX \`student_groups_start_date_idx\` (\`start_date\`),
                INDEX \`student_groups_teacher_id_idx\` (\`teacherReferenceId\`),
                INDEX \`student_groups_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_groups\`
            ADD CONSTRAINT \`FK_f4177214adb5b7e3d2cf2d0918a\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`student_groups\` DROP FOREIGN KEY \`FK_f4177214adb5b7e3d2cf2d0918a\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_groups_user_id_idx\` ON \`student_groups\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_groups_teacher_id_idx\` ON \`student_groups\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_groups_start_date_idx\` ON \`student_groups\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_groups_end_date_idx\` ON \`student_groups\`
        `);
        await queryRunner.query(`
            DROP TABLE \`student_groups\`
        `);
    }

}
