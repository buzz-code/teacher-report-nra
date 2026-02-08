import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSalaryReportByTeacherView1770583441090 implements MigrationInterface {
    name = 'UpdateSalaryReportByTeacherView1770583441090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","salary_report_by_teacher","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`salary_report_by_teacher\`
        `);
        await queryRunner.query(`
            CREATE VIEW \`salary_report_by_teacher\` AS
            SELECT CONCAT(
                    rip.salaryReportId,
                    '_',
                    rip.teacherReferenceId,
                    '_',
                    YEAR(rip.reportDate),
                    '_',
                    MONTH(rip.reportDate)
                ) AS id,
                rip.userId,
                rip.salaryReportId,
                rip.teacherReferenceId,
                YEAR(rip.reportDate) AS reportYear,
                MONTH(rip.reportDate) AS reportMonth,
                -- Counts by type
                SUM(
                    CASE
                        WHEN rip.type = 'answer' THEN 1
                        ELSE 0
                    END
                ) AS answerCount,
                SUM(
                    CASE
                        WHEN rip.type = 'report' THEN 1
                        ELSE 0
                    END
                ) AS attReportCount,
                -- Totals by type
                SUM(
                    CASE
                        WHEN rip.type = 'answer' THEN rip.calculatedPrice
                        ELSE 0
                    END
                ) AS answersTotal,
                SUM(
                    CASE
                        WHEN rip.type = 'report' THEN rip.calculatedPrice
                        ELSE 0
                    END
                ) AS attReportsTotal,
                -- Grand total
                SUM(rip.calculatedPrice) AS grandTotal
            FROM reportable_item_with_price rip
            WHERE rip.salaryReportId IS NOT NULL
                AND rip.teacherReferenceId IS NOT NULL
                AND rip.reportDate IS NOT NULL
            GROUP BY rip.userId,
                rip.salaryReportId,
                rip.teacherReferenceId,
                YEAR(rip.reportDate),
                MONTH(rip.reportDate)
        `);
        await queryRunner.query(`
            INSERT INTO \`teacher_report_nra\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)
        `, ["teacher_report_nra","VIEW","salary_report_by_teacher","SELECT\n      CONCAT(rip.salaryReportId, '_', rip.teacherReferenceId, '_', YEAR(rip.reportDate), '_', MONTH(rip.reportDate)) AS id,\n      rip.userId,\n      rip.salaryReportId,\n      rip.teacherReferenceId,\n      YEAR(rip.reportDate) AS reportYear,\n      MONTH(rip.reportDate) AS reportMonth,\n      \n      -- Counts by type\n      SUM(CASE WHEN rip.type = 'answer' THEN 1 ELSE 0 END) AS answerCount,\n      SUM(CASE WHEN rip.type = 'report' THEN 1 ELSE 0 END) AS attReportCount,\n      \n      -- Totals by type\n      SUM(CASE WHEN rip.type = 'answer' THEN rip.calculatedPrice ELSE 0 END) AS answersTotal,\n      SUM(CASE WHEN rip.type = 'report' THEN rip.calculatedPrice ELSE 0 END) AS attReportsTotal,\n      \n      -- Grand total\n      SUM(rip.calculatedPrice) AS grandTotal\n      \n    FROM reportable_item_with_price rip\n    WHERE rip.salaryReportId IS NOT NULL\n      AND rip.teacherReferenceId IS NOT NULL\n      AND rip.reportDate IS NOT NULL\n    GROUP BY rip.userId, rip.salaryReportId, rip.teacherReferenceId, YEAR(rip.reportDate), MONTH(rip.reportDate)"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","salary_report_by_teacher","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`salary_report_by_teacher\`
        `);
        await queryRunner.query(`
            CREATE VIEW \`salary_report_by_teacher\` AS
            SELECT CONCAT(rip.salaryReportId, '_', rip.teacherReferenceId) AS id,
                rip.userId,
                rip.salaryReportId,
                rip.teacherReferenceId,
                -- Counts by type
                SUM(
                    CASE
                        WHEN rip.type = 'answer' THEN 1
                        ELSE 0
                    END
                ) AS answerCount,
                SUM(
                    CASE
                        WHEN rip.type = 'report' THEN 1
                        ELSE 0
                    END
                ) AS attReportCount,
                -- Totals by type
                SUM(
                    CASE
                        WHEN rip.type = 'answer' THEN rip.calculatedPrice
                        ELSE 0
                    END
                ) AS answersTotal,
                SUM(
                    CASE
                        WHEN rip.type = 'report' THEN rip.calculatedPrice
                        ELSE 0
                    END
                ) AS attReportsTotal,
                -- Grand total
                SUM(rip.calculatedPrice) AS grandTotal
            FROM reportable_item_with_price rip
            WHERE rip.salaryReportId IS NOT NULL
                AND rip.teacherReferenceId IS NOT NULL
            GROUP BY rip.userId,
                rip.salaryReportId,
                rip.teacherReferenceId
        `);
        await queryRunner.query(`
            INSERT INTO \`teacher_report_nra\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)
        `, ["teacher_report_nra","VIEW","salary_report_by_teacher","SELECT\n      CONCAT(rip.salaryReportId, '_', rip.teacherReferenceId) AS id,\n      rip.userId,\n      rip.salaryReportId,\n      rip.teacherReferenceId,\n      \n      -- Counts by type\n      SUM(CASE WHEN rip.type = 'answer' THEN 1 ELSE 0 END) AS answerCount,\n      SUM(CASE WHEN rip.type = 'report' THEN 1 ELSE 0 END) AS attReportCount,\n      \n      -- Totals by type\n      SUM(CASE WHEN rip.type = 'answer' THEN rip.calculatedPrice ELSE 0 END) AS answersTotal,\n      SUM(CASE WHEN rip.type = 'report' THEN rip.calculatedPrice ELSE 0 END) AS attReportsTotal,\n      \n      -- Grand total\n      SUM(rip.calculatedPrice) AS grandTotal\n      \n    FROM reportable_item_with_price rip\n    WHERE rip.salaryReportId IS NOT NULL\n      AND rip.teacherReferenceId IS NOT NULL\n    GROUP BY rip.userId, rip.salaryReportId, rip.teacherReferenceId"]);
    }

}
