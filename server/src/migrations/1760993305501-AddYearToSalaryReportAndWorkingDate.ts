import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYearToSalaryReportAndWorkingDate1760993305501 implements MigrationInterface {
    name = 'AddYearToSalaryReportAndWorkingDate1760993305501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`salary_reports\`
            ADD \`year\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`working_dates\`
            ADD \`year\` int NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`salary_reports_year_idx\` ON \`salary_reports\` (\`year\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`working_dates_year_idx\` ON \`working_dates\` (\`year\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`working_dates_year_idx\` ON \`working_dates\`
        `);
        await queryRunner.query(`
            DROP INDEX \`salary_reports_year_idx\` ON \`salary_reports\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`working_dates\` DROP COLUMN \`year\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`salary_reports\` DROP COLUMN \`year\`
        `);
    }

}
