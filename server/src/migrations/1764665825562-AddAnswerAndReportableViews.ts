import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnswerAndReportableViews1764665825562 implements MigrationInterface {
  name = 'AddAnswerAndReportableViews1764665825562';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`
            CREATE VIEW \`answer_with_price\` AS
            SELECT a.id,
                a.user_id AS userId,
                a.teacherReferenceId,
                a.teacherTz,
                a.questionReferenceId,
                a.questionId,
                a.salary_report_id AS salaryReportId,
                a.answer,
                a.report_date AS reportDate,
                a.createdAt,
                a.updatedAt,
                -- Question fields for price explanation on frontend
                q.content AS questionContent,
                q.tariff AS questionTariff,
                q.questionTypeReferenceId,
                q.questionTypeKey,
                -- Calculated price: answer × tariff
                COALESCE(a.answer * q.tariff, 0) AS calculatedPrice
            FROM answers a
                LEFT JOIN questions q ON q.id = a.questionReferenceId
                AND q.user_id = a.user_id
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
        'answer_with_price',
        'SELECT\n      a.id,\n      a.user_id AS userId,\n      a.teacherReferenceId,\n      a.teacherTz,\n      a.questionReferenceId,\n      a.questionId,\n      a.salary_report_id AS salaryReportId,\n      a.answer,\n      a.report_date AS reportDate,\n      a.createdAt,\n      a.updatedAt,\n      \n      -- Question fields for price explanation on frontend\n      q.content AS questionContent,\n      q.tariff AS questionTariff,\n      q.questionTypeReferenceId,\n      q.questionTypeKey,\n      \n      -- Calculated price: answer × tariff\n      COALESCE(a.answer * q.tariff, 0) AS calculatedPrice\n      \n    FROM answers a\n    LEFT JOIN questions q ON q.id = a.questionReferenceId AND q.user_id = a.user_id',
      ],
    );
    await queryRunner.query(`
            CREATE VIEW \`reportable_item_with_price\` AS
            SELECT CONCAT('report_', id) AS id,
                'report' AS type,
                userId,
                teacherReferenceId,
                salaryReportId,
                reportDate,
                calculatedPrice,
                createdAt
            FROM att_report_with_price
            UNION ALL
            SELECT CONCAT('answer_', id) AS id,
                'answer' AS type,
                userId,
                teacherReferenceId,
                salaryReportId,
                reportDate,
                calculatedPrice,
                createdAt
            FROM answer_with_price
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
        'reportable_item_with_price',
        "SELECT\n      CONCAT('report_', id) AS id,\n      'report' AS type,\n      userId,\n      teacherReferenceId,\n      salaryReportId,\n      reportDate,\n      calculatedPrice,\n      createdAt\n    FROM att_report_with_price\n    \n    UNION ALL\n    \n    SELECT\n      CONCAT('answer_', id) AS id,\n      'answer' AS type,\n      userId,\n      teacherReferenceId,\n      salaryReportId,\n      reportDate,\n      calculatedPrice,\n      createdAt\n    FROM answer_with_price",
      ],
    );
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
        "SELECT\n      CONCAT(rip.salaryReportId, '_', rip.teacherReferenceId) AS id,\n      rip.userId,\n      rip.salaryReportId,\n      rip.teacherReferenceId,\n      \n      -- Counts by type\n      SUM(CASE WHEN rip.type = 'answer' THEN 1 ELSE 0 END) AS answerCount,\n      SUM(CASE WHEN rip.type = 'report' THEN 1 ELSE 0 END) AS attReportCount,\n      \n      -- Totals by type\n      SUM(CASE WHEN rip.type = 'answer' THEN rip.calculatedPrice ELSE 0 END) AS answersTotal,\n      SUM(CASE WHEN rip.type = 'report' THEN rip.calculatedPrice ELSE 0 END) AS attReportsTotal,\n      \n      -- Grand total\n      SUM(rip.calculatedPrice) AS grandTotal\n      \n    FROM reportable_item_with_price rip\n    WHERE rip.salaryReportId IS NOT NULL\n      AND rip.teacherReferenceId IS NOT NULL\n    GROUP BY rip.userId, rip.salaryReportId, rip.teacherReferenceId",
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
    await queryRunner.query(
      `
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `,
      ['VIEW', 'reportable_item_with_price', 'teacher_report_nra'],
    );
    await queryRunner.query(`
            DROP VIEW \`reportable_item_with_price\`
        `);
    await queryRunner.query(
      `
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `,
      ['VIEW', 'answer_with_price', 'teacher_report_nra'],
    );
    await queryRunner.query(`
            DROP VIEW \`answer_with_price\`
        `);
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
}
