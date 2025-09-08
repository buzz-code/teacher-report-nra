import { MigrationInterface, QueryRunner } from "typeorm";

export class SalaryReportEnhancement1757355957899 implements MigrationInterface {
    name = 'SalaryReportEnhancement1757355957899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_c632b11e00aadd79d1ffad736f6\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_answer_date_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_report_id_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\` CHANGE \`salary_report\` \`salary_report_id\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`salary_reports\` DROP COLUMN \`ids\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`answer_date\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`report_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`salary_report_id\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`report_date\` date NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`answers_report_date_idx\` ON \`answers\` (\`report_date\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_549eba339b821b759c3ad78b8fe\` FOREIGN KEY (\`salary_report_id\`) REFERENCES \`salary_reports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_646d34c92b0f297ede9d16702a4\` FOREIGN KEY (\`salary_report_id\`) REFERENCES \`salary_reports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_646d34c92b0f297ede9d16702a4\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_549eba339b821b759c3ad78b8fe\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_report_date_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`report_date\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`salary_report_id\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`report_id\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`answer_date\` date NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`salary_reports\`
            ADD \`ids\` text NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\` CHANGE \`salary_report_id\` \`salary_report\` int NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`answers_report_id_idx\` ON \`answers\` (\`report_id\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`answers_answer_date_idx\` ON \`answers\` (\`answer_date\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_c632b11e00aadd79d1ffad736f6\` FOREIGN KEY (\`report_id\`) REFERENCES \`att_reports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
