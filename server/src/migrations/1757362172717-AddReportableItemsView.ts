import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportableItemsView1757362172717 implements MigrationInterface {
  name = 'AddReportableItemsView1757362172717';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE VIEW \`reportable_items\` AS
            SELECT CONCAT('report_', id) as id,
                'report' as type,
                user_id as userId,
                teacherReferenceId,
                report_date as reportDate,
                salary_report_id as salaryReportId,
                createdAt
            FROM att_reports
            UNION ALL
            SELECT CONCAT('answer_', id) as id,
                'answer' as type,
                user_id as userId,
                teacherReferenceId,
                report_date as reportDate,
                salary_report_id as salaryReportId,
                createdAt
            FROM answers
        `);
    await queryRunner.query(
      `
            INSERT INTO \`teacher_report_nra\`.\`typeorm_metadata\`(
                    \`database\`,
                    \`schema\`,
                    \`table\`,
                    \`type\`,
                    \`name\`,
                    \`value\`
                )
            VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)
        `,
      [
        'teacher_report_nra',
        'VIEW',
        'reportable_items',
        "SELECT \n      CONCAT('report_', id) as id,\n      'report' as type,\n      user_id as userId,\n      teacherReferenceId,\n      report_date as reportDate,\n      salary_report_id as salaryReportId,\n      createdAt\n    FROM att_reports\n    \n    UNION ALL\n    \n    SELECT \n      CONCAT('answer_', id) as id,\n      'answer' as type,\n      user_id as userId,\n      teacherReferenceId,\n      report_date as reportDate,\n      salary_report_id as salaryReportId,\n      createdAt\n    FROM answers",
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `,
      ['VIEW', 'reportable_items', 'teacher_report_nra'],
    );
    await queryRunner.query(`
            DROP VIEW \`reportable_items\`
        `);
  }
}
