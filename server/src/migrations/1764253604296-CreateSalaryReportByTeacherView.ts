import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSalaryReportByTeacherView1764253604296 implements MigrationInterface {
  name = 'CreateSalaryReportByTeacherView1764253604296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE VIEW \`salary_report_by_teacher\` AS
            SELECT \`ri\`.\`userId\` AS \`userId\`,
                \`ri\`.\`teacherReferenceId\` AS \`teacherReferenceId\`,
                \`ri\`.\`salaryReportId\` AS \`salaryReportId\`,
                CONCAT(
                    \`ri\`.\`salaryReportId\`,
                    "_",
                    \`ri\`.\`teacherReferenceId\`
                ) AS \`id\`
            FROM \`reportable_items\` \`ri\`
            WHERE \`ri\`.\`salaryReportId\` IS NOT NULL
                AND \`ri\`.\`teacherReferenceId\` IS NOT NULL
            GROUP BY \`ri\`.\`userId\`,
                \`ri\`.\`salaryReportId\`,
                \`ri\`.\`teacherReferenceId\`
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
        'salary_report_by_teacher',
        'SELECT `ri`.`userId` AS `userId`, `ri`.`teacherReferenceId` AS `teacherReferenceId`, `ri`.`salaryReportId` AS `salaryReportId`, CONCAT(`ri`.`salaryReportId`, "_", `ri`.`teacherReferenceId`) AS `id` FROM `reportable_items` `ri` WHERE `ri`.`salaryReportId` IS NOT NULL AND `ri`.`teacherReferenceId` IS NOT NULL GROUP BY `ri`.`userId`, `ri`.`salaryReportId`, `ri`.`teacherReferenceId`',
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
      ['VIEW', 'salary_report_by_teacher', 'teacher_report_nra'],
    );
    await queryRunner.query(`
            DROP VIEW \`salary_report_by_teacher\`
        `);
  }
}
