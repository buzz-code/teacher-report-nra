import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAbsencePrices1769074524558 implements MigrationInterface {
    name = 'AddAbsencePrices1769074524558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","att_report_with_price","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW IF EXISTS \`att_report_with_price\`
        `);
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","user_price_pivot","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW IF EXISTS \`user_price_pivot\`
        `);
        await queryRunner.query(`
            CREATE VIEW \`user_price_pivot\` AS
            SELECT u.id AS userId,
                MAX(
                    CASE
                        WHEN p.code = 'lesson.base' THEN p.price
                    END
                ) AS lesson_base,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.student_multiplier' THEN p.price
                    END
                ) AS seminar_student,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.lesson_multiplier' THEN p.price
                    END
                ) AS seminar_lesson,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.watch_individual_multiplier' THEN p.price
                    END
                ) AS seminar_watch,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.interfere_teach_multiplier' THEN p.price
                    END
                ) AS seminar_interfere,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.discussing_lesson_multiplier' THEN p.price
                    END
                ) AS seminar_discuss,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.absence_multiplier' THEN p.price
                    END
                ) AS seminar_absence,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.kamal_bonus' THEN p.price
                    END
                ) AS seminar_kamal,
                MAX(
                    CASE
                        WHEN p.code = 'manha.student_multiplier' THEN p.price
                    END
                ) AS manha_student,
                MAX(
                    CASE
                        WHEN p.code = 'manha.methodic_multiplier' THEN p.price
                    END
                ) AS manha_methodic,
                MAX(
                    CASE
                        WHEN p.code = 'manha.taarif_hulia_bonus' THEN p.price
                    END
                ) AS manha_hulia1,
                MAX(
                    CASE
                        WHEN p.code = 'manha.taarif_hulia2_bonus' THEN p.price
                    END
                ) AS manha_hulia2,
                MAX(
                    CASE
                        WHEN p.code = 'manha.taarif_hulia3_bonus' THEN p.price
                    END
                ) AS manha_hulia3,
                MAX(
                    CASE
                        WHEN p.code = 'manha.watched_lesson_multiplier' THEN p.price
                    END
                ) AS manha_watched,
                MAX(
                    CASE
                        WHEN p.code = 'manha.discussing_lesson_multiplier' THEN p.price
                    END
                ) AS manha_discuss,
                MAX(
                    CASE
                        WHEN p.code = 'manha.yalkut_lesson_multiplier' THEN p.price
                    END
                ) AS manha_yalkut,
                MAX(
                    CASE
                        WHEN p.code = 'manha.help_taught_multiplier' THEN p.price
                    END
                ) AS manha_help,
                MAX(
                    CASE
                        WHEN p.code = 'manha.absence_multiplier' THEN p.price
                    END
                ) AS manha_absence,
                MAX(
                    CASE
                        WHEN p.code = 'pds.watch_individual_multiplier' THEN p.price
                    END
                ) AS pds_watch,
                MAX(
                    CASE
                        WHEN p.code = 'pds.interfere_teach_multiplier' THEN p.price
                    END
                ) AS pds_interfere,
                MAX(
                    CASE
                        WHEN p.code = 'pds.discussing_lesson_multiplier' THEN p.price
                    END
                ) AS pds_discuss,
                MAX(
                    CASE
                        WHEN p.code = 'pds.absence_multiplier' THEN p.price
                    END
                ) AS pds_absence,
                MAX(
                    CASE
                        WHEN p.code = 'kindergarten.student_multiplier' THEN p.price
                    END
                ) AS kinder_student,
                MAX(
                    CASE
                        WHEN p.code = 'kindergarten.collective_watch_bonus' THEN p.price
                    END
                ) AS kinder_collective,
                MAX(
                    CASE
                        WHEN p.code = 'kindergarten.absence_multiplier' THEN p.price
                    END
                ) AS kinder_absence,
                MAX(
                    CASE
                        WHEN p.code = 'special.student_multiplier' THEN p.price
                    END
                ) AS special_student,
                MAX(
                    CASE
                        WHEN p.code = 'special.lesson_multiplier' THEN p.price
                    END
                ) AS special_lesson,
                MAX(
                    CASE
                        WHEN p.code = 'special.phone_discussion_bonus' THEN p.price
                    END
                ) AS special_phone,
                MAX(
                    CASE
                        WHEN p.code = 'special.absence_multiplier' THEN p.price
                    END
                ) AS special_absence
            FROM users u
                LEFT JOIN price_by_user p ON p.userId = u.id
            WHERE u.effective_id IS NULL
            GROUP BY u.id
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
        `, ["teacher_report_nra","VIEW","user_price_pivot","SELECT \n      u.id AS userId,\n      MAX(CASE WHEN p.code = 'lesson.base' THEN p.price END) AS lesson_base,\n    MAX(CASE WHEN p.code = 'seminar.student_multiplier' THEN p.price END) AS seminar_student,\n    MAX(CASE WHEN p.code = 'seminar.lesson_multiplier' THEN p.price END) AS seminar_lesson,\n    MAX(CASE WHEN p.code = 'seminar.watch_individual_multiplier' THEN p.price END) AS seminar_watch,\n    MAX(CASE WHEN p.code = 'seminar.interfere_teach_multiplier' THEN p.price END) AS seminar_interfere,\n    MAX(CASE WHEN p.code = 'seminar.discussing_lesson_multiplier' THEN p.price END) AS seminar_discuss,\n    MAX(CASE WHEN p.code = 'seminar.absence_multiplier' THEN p.price END) AS seminar_absence,\n    MAX(CASE WHEN p.code = 'seminar.kamal_bonus' THEN p.price END) AS seminar_kamal,\n    MAX(CASE WHEN p.code = 'manha.student_multiplier' THEN p.price END) AS manha_student,\n    MAX(CASE WHEN p.code = 'manha.methodic_multiplier' THEN p.price END) AS manha_methodic,\n    MAX(CASE WHEN p.code = 'manha.taarif_hulia_bonus' THEN p.price END) AS manha_hulia1,\n    MAX(CASE WHEN p.code = 'manha.taarif_hulia2_bonus' THEN p.price END) AS manha_hulia2,\n    MAX(CASE WHEN p.code = 'manha.taarif_hulia3_bonus' THEN p.price END) AS manha_hulia3,\n    MAX(CASE WHEN p.code = 'manha.watched_lesson_multiplier' THEN p.price END) AS manha_watched,\n    MAX(CASE WHEN p.code = 'manha.discussing_lesson_multiplier' THEN p.price END) AS manha_discuss,\n    MAX(CASE WHEN p.code = 'manha.yalkut_lesson_multiplier' THEN p.price END) AS manha_yalkut,\n    MAX(CASE WHEN p.code = 'manha.help_taught_multiplier' THEN p.price END) AS manha_help,\n    MAX(CASE WHEN p.code = 'manha.absence_multiplier' THEN p.price END) AS manha_absence,\n    MAX(CASE WHEN p.code = 'pds.watch_individual_multiplier' THEN p.price END) AS pds_watch,\n    MAX(CASE WHEN p.code = 'pds.interfere_teach_multiplier' THEN p.price END) AS pds_interfere,\n    MAX(CASE WHEN p.code = 'pds.discussing_lesson_multiplier' THEN p.price END) AS pds_discuss,\n    MAX(CASE WHEN p.code = 'pds.absence_multiplier' THEN p.price END) AS pds_absence,\n    MAX(CASE WHEN p.code = 'kindergarten.student_multiplier' THEN p.price END) AS kinder_student,\n    MAX(CASE WHEN p.code = 'kindergarten.collective_watch_bonus' THEN p.price END) AS kinder_collective,\n    MAX(CASE WHEN p.code = 'kindergarten.absence_multiplier' THEN p.price END) AS kinder_absence,\n    MAX(CASE WHEN p.code = 'special.student_multiplier' THEN p.price END) AS special_student,\n    MAX(CASE WHEN p.code = 'special.lesson_multiplier' THEN p.price END) AS special_lesson,\n    MAX(CASE WHEN p.code = 'special.phone_discussion_bonus' THEN p.price END) AS special_phone,\n    MAX(CASE WHEN p.code = 'special.absence_multiplier' THEN p.price END) AS special_absence\n    FROM users u\n    LEFT JOIN price_by_user p ON p.userId = u.id\n    WHERE u.effective_id IS NULL\n    GROUP BY u.id"]);
        await queryRunner.query(`
            CREATE VIEW \`att_report_with_price\` AS
            SELECT r.id,
                r.user_id AS userId,
                r.teacherReferenceId,
                r.teacherTz,
                r.report_date AS reportDate,
                r.update_date AS updateDate,
                r.salary_report_id AS salaryReportId,
                r.salary_month AS salaryMonth,
                r.comment,
                r.year,
                r.createdAt,
                r.updatedAt,
                t.teacherTypeReferenceId,
                tt.\`key\` AS teacherTypeKey,
                -- Report fields needed for price explanation
                r.how_many_students AS howManyStudents,
                r.how_many_students_teached AS howManyStudentsTeached,
                r.how_many_students_watched AS howManyStudentsWatched,
                r.how_many_students_help_teached AS howManyStudentsHelpTeached,
                r.how_many_lessons AS howManyLessons,
                r.how_many_yalkut_lessons AS howManyYalkutLessons,
                r.how_many_discussing_lessons AS howManyDiscussingLessons,
                r.how_many_watched_lessons AS howManyWatchedLessons,
                r.how_many_watch_or_individual AS howManyWatchOrIndividual,
                r.how_many_teached_or_interfering AS howManyTeachedOrInterfering,
                r.how_many_methodic AS howManyMethodic,
                r.how_many_lessons_absence AS howManyLessonsAbsence,
                r.was_phone_discussing AS wasPhoneDiscussing,
                r.was_kamal AS wasKamal,
                r.was_collective_watch AS wasCollectiveWatch,
                r.is_taarif_hulia AS isTaarifHulia,
                r.is_taarif_hulia2 AS isTaarifHulia2,
                r.is_taarif_hulia3 AS isTaarifHulia3,
                -- Total calculated price (base + components)
                (
                    COALESCE(up.lesson_base, 0) + CASE
                        tt.\`key\`
                        WHEN 1 THEN -- SEMINAR_KITA
                        COALESCE(r.how_many_students * up.seminar_student, 0) + COALESCE(r.how_many_lessons * up.seminar_lesson, 0) + COALESCE(
                            r.how_many_discussing_lessons * r.how_many_students * up.seminar_discuss,
                            0
                        ) + COALESCE(
                            r.how_many_watch_or_individual * r.how_many_students * up.seminar_watch,
                            0
                        ) + COALESCE(
                            r.how_many_teached_or_interfering * r.how_many_students * up.seminar_interfere,
                            0
                        ) + COALESCE(
                            r.how_many_lessons_absence * up.seminar_absence,
                            0
                        ) + COALESCE(
                            r.was_kamal * r.how_many_students * up.seminar_kamal,
                            0
                        )
                        WHEN 3 THEN -- MANHA
                        COALESCE(
                            r.how_many_students_teached * up.manha_student,
                            0
                        ) + COALESCE(
                            r.how_many_students_help_teached * up.manha_help,
                            0
                        ) + COALESCE(r.how_many_yalkut_lessons * up.manha_yalkut, 0) + COALESCE(
                            r.how_many_discussing_lessons * up.manha_discuss,
                            0
                        ) + COALESCE(r.how_many_watched_lessons * up.manha_watched, 0) + COALESCE(r.how_many_methodic * up.manha_methodic, 0) + COALESCE(r.how_many_lessons_absence * up.manha_absence, 0) + COALESCE(r.is_taarif_hulia * up.manha_hulia1, 0) + COALESCE(r.is_taarif_hulia2 * up.manha_hulia2, 0) + COALESCE(r.is_taarif_hulia3 * up.manha_hulia3, 0)
                        WHEN 5 THEN -- PDS
                        COALESCE(
                            r.how_many_discussing_lessons * up.pds_discuss,
                            0
                        ) + COALESCE(r.how_many_watch_or_individual * up.pds_watch, 0) + COALESCE(
                            r.how_many_teached_or_interfering * up.pds_interfere,
                            0
                        ) + COALESCE(r.how_many_lessons_absence * up.pds_absence, 0)
                        WHEN 6 THEN -- KINDERGARTEN
                        COALESCE(r.how_many_students * up.kinder_student, 0) + COALESCE(
                            r.how_many_lessons_absence * up.kinder_absence,
                            0
                        ) + COALESCE(r.was_collective_watch * up.kinder_collective, 0)
                        WHEN 7 THEN -- SPECIAL_EDUCATION
                        COALESCE(
                            r.how_many_students_teached * up.special_student,
                            0
                        ) + COALESCE(
                            r.how_many_students_watched * up.special_student * 0.5,
                            0
                        ) + COALESCE(r.how_many_lessons * up.special_lesson, 0) + COALESCE(
                            r.how_many_lessons_absence * up.special_absence,
                            0
                        ) + COALESCE(r.was_phone_discussing * up.special_phone, 0)
                        ELSE 0
                    END
                ) AS calculatedPrice
            FROM att_reports r
                INNER JOIN teachers t ON t.id = r.teacherReferenceId
                AND t.user_id = r.user_id
                INNER JOIN teacher_types tt ON tt.id = t.teacherTypeReferenceId
                AND tt.user_id = r.user_id
                INNER JOIN user_price_pivot up ON up.userId = r.user_id
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
        `, ["teacher_report_nra","VIEW","att_report_with_price","SELECT\n      r.id,\n      r.user_id AS userId,\n      r.teacherReferenceId,\n      r.teacherTz,\n      r.report_date AS reportDate,\n      r.update_date AS updateDate,\n      r.salary_report_id AS salaryReportId,\n      r.salary_month AS salaryMonth,\n      r.comment,\n      r.year,\n      r.createdAt,\n      r.updatedAt,\n      t.teacherTypeReferenceId,\n      tt.`key` AS teacherTypeKey,\n      \n      -- Report fields needed for price explanation\n      r.how_many_students AS howManyStudents,\n      r.how_many_students_teached AS howManyStudentsTeached,\n      r.how_many_students_watched AS howManyStudentsWatched,\n      r.how_many_students_help_teached AS howManyStudentsHelpTeached,\n      r.how_many_lessons AS howManyLessons,\n      r.how_many_yalkut_lessons AS howManyYalkutLessons,\n      r.how_many_discussing_lessons AS howManyDiscussingLessons,\n      r.how_many_watched_lessons AS howManyWatchedLessons,\n      r.how_many_watch_or_individual AS howManyWatchOrIndividual,\n      r.how_many_teached_or_interfering AS howManyTeachedOrInterfering,\n      r.how_many_methodic AS howManyMethodic,\n      r.how_many_lessons_absence AS howManyLessonsAbsence,\n      r.was_phone_discussing AS wasPhoneDiscussing,\n      r.was_kamal AS wasKamal,\n      r.was_collective_watch AS wasCollectiveWatch,\n      r.is_taarif_hulia AS isTaarifHulia,\n      r.is_taarif_hulia2 AS isTaarifHulia2,\n      r.is_taarif_hulia3 AS isTaarifHulia3,\n      \n      -- Total calculated price (base + components)\n      (\n        COALESCE(up.lesson_base, 0) +\n        CASE tt.`key`\n          WHEN 1 THEN -- SEMINAR_KITA\n            COALESCE(r.how_many_students * up.seminar_student, 0) +\n            COALESCE(r.how_many_lessons * up.seminar_lesson, 0) +\n            COALESCE(r.how_many_discussing_lessons * r.how_many_students * up.seminar_discuss, 0) +\n            COALESCE(r.how_many_watch_or_individual * r.how_many_students * up.seminar_watch, 0) +\n            COALESCE(r.how_many_teached_or_interfering * r.how_many_students * up.seminar_interfere, 0) +\n            COALESCE(r.how_many_lessons_absence * up.seminar_absence, 0) +\n            COALESCE(r.was_kamal * r.how_many_students * up.seminar_kamal, 0)\n          WHEN 3 THEN -- MANHA\n            COALESCE(r.how_many_students_teached * up.manha_student, 0) +\n            COALESCE(r.how_many_students_help_teached * up.manha_help, 0) +\n            COALESCE(r.how_many_yalkut_lessons * up.manha_yalkut, 0) +\n            COALESCE(r.how_many_discussing_lessons * up.manha_discuss, 0) +\n            COALESCE(r.how_many_watched_lessons * up.manha_watched, 0) +\n            COALESCE(r.how_many_methodic * up.manha_methodic, 0) +\n            COALESCE(r.how_many_lessons_absence * up.manha_absence, 0) +\n            COALESCE(r.is_taarif_hulia * up.manha_hulia1, 0) +\n            COALESCE(r.is_taarif_hulia2 * up.manha_hulia2, 0) +\n            COALESCE(r.is_taarif_hulia3 * up.manha_hulia3, 0)\n          WHEN 5 THEN -- PDS\n            COALESCE(r.how_many_discussing_lessons * up.pds_discuss, 0) +\n            COALESCE(r.how_many_watch_or_individual * up.pds_watch, 0) +\n            COALESCE(r.how_many_teached_or_interfering * up.pds_interfere, 0) +\n            COALESCE(r.how_many_lessons_absence * up.pds_absence, 0)\n          WHEN 6 THEN -- KINDERGARTEN\n            COALESCE(r.how_many_students * up.kinder_student, 0) +\n            COALESCE(r.how_many_lessons_absence * up.kinder_absence, 0) +\n            COALESCE(r.was_collective_watch * up.kinder_collective, 0)\n          WHEN 7 THEN -- SPECIAL_EDUCATION\n            COALESCE(r.how_many_students_teached * up.special_student, 0) +\n            COALESCE(r.how_many_students_watched * up.special_student * 0.5, 0) +\n            COALESCE(r.how_many_lessons * up.special_lesson, 0) +\n            COALESCE(r.how_many_lessons_absence * up.special_absence, 0) +\n            COALESCE(r.was_phone_discussing * up.special_phone, 0)\n          ELSE 0\n        END\n      ) AS calculatedPrice\n      \n    FROM att_reports r\n    INNER JOIN teachers t ON t.id = r.teacherReferenceId AND t.user_id = r.user_id\n    INNER JOIN teacher_types tt ON tt.id = t.teacherTypeReferenceId AND tt.user_id = r.user_id\n    INNER JOIN user_price_pivot up ON up.userId = r.user_id"]);

        // Seed absence prices with 50 NIS for userId = 0 (system defaults)
        const codes = [
            'seminar.absence_multiplier',
            'manha.absence_multiplier',
            'pds.absence_multiplier',
            'kindergarten.absence_multiplier',
            'special.absence_multiplier'
        ];
        
        for (const code of codes) {
            await queryRunner.query(`
                INSERT INTO \`prices\` (\`user_id\`, \`code\`, \`description\`, \`price\`)
                VALUES (0, ?, 'תעריף היעדרות', 50.0)
                ON DUPLICATE KEY UPDATE \`price\` = 50.0
            `, [code]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","att_report_with_price","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW IF EXISTS \`att_report_with_price\`
        `);
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","user_price_pivot","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW IF EXISTS \`user_price_pivot\`
        `);
        await queryRunner.query(`
            CREATE VIEW \`user_price_pivot\` AS
            SELECT u.id AS userId,
                MAX(
                    CASE
                        WHEN p.code = 'lesson.base' THEN p.price
                    END
                ) AS lesson_base,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.student_multiplier' THEN p.price
                    END
                ) AS seminar_student,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.lesson_multiplier' THEN p.price
                    END
                ) AS seminar_lesson,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.watch_individual_multiplier' THEN p.price
                    END
                ) AS seminar_watch,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.interfere_teach_multiplier' THEN p.price
                    END
                ) AS seminar_interfere,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.discussing_lesson_multiplier' THEN p.price
                    END
                ) AS seminar_discuss,
                MAX(
                    CASE
                        WHEN p.code = 'seminar.kamal_bonus' THEN p.price
                    END
                ) AS seminar_kamal,
                MAX(
                    CASE
                        WHEN p.code = 'manha.student_multiplier' THEN p.price
                    END
                ) AS manha_student,
                MAX(
                    CASE
                        WHEN p.code = 'manha.methodic_multiplier' THEN p.price
                    END
                ) AS manha_methodic,
                MAX(
                    CASE
                        WHEN p.code = 'manha.taarif_hulia_bonus' THEN p.price
                    END
                ) AS manha_hulia1,
                MAX(
                    CASE
                        WHEN p.code = 'manha.taarif_hulia2_bonus' THEN p.price
                    END
                ) AS manha_hulia2,
                MAX(
                    CASE
                        WHEN p.code = 'manha.taarif_hulia3_bonus' THEN p.price
                    END
                ) AS manha_hulia3,
                MAX(
                    CASE
                        WHEN p.code = 'manha.watched_lesson_multiplier' THEN p.price
                    END
                ) AS manha_watched,
                MAX(
                    CASE
                        WHEN p.code = 'manha.discussing_lesson_multiplier' THEN p.price
                    END
                ) AS manha_discuss,
                MAX(
                    CASE
                        WHEN p.code = 'manha.yalkut_lesson_multiplier' THEN p.price
                    END
                ) AS manha_yalkut,
                MAX(
                    CASE
                        WHEN p.code = 'manha.help_taught_multiplier' THEN p.price
                    END
                ) AS manha_help,
                MAX(
                    CASE
                        WHEN p.code = 'pds.watch_individual_multiplier' THEN p.price
                    END
                ) AS pds_watch,
                MAX(
                    CASE
                        WHEN p.code = 'pds.interfere_teach_multiplier' THEN p.price
                    END
                ) AS pds_interfere,
                MAX(
                    CASE
                        WHEN p.code = 'pds.discussing_lesson_multiplier' THEN p.price
                    END
                ) AS pds_discuss,
                MAX(
                    CASE
                        WHEN p.code = 'kindergarten.student_multiplier' THEN p.price
                    END
                ) AS kinder_student,
                MAX(
                    CASE
                        WHEN p.code = 'kindergarten.collective_watch_bonus' THEN p.price
                    END
                ) AS kinder_collective,
                MAX(
                    CASE
                        WHEN p.code = 'special.student_multiplier' THEN p.price
                    END
                ) AS special_student,
                MAX(
                    CASE
                        WHEN p.code = 'special.lesson_multiplier' THEN p.price
                    END
                ) AS special_lesson,
                MAX(
                    CASE
                        WHEN p.code = 'special.phone_discussion_bonus' THEN p.price
                    END
                ) AS special_phone
            FROM users u
                LEFT JOIN price_by_user p ON p.userId = u.id
            WHERE u.effective_id IS NULL
            GROUP BY u.id
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
        `, ["teacher_report_nra","VIEW","user_price_pivot","SELECT \n      u.id AS userId,\n      MAX(CASE WHEN p.code = 'lesson.base' THEN p.price END) AS lesson_base,\n    MAX(CASE WHEN p.code = 'seminar.student_multiplier' THEN p.price END) AS seminar_student,\n    MAX(CASE WHEN p.code = 'seminar.lesson_multiplier' THEN p.price END) AS seminar_lesson,\n    MAX(CASE WHEN p.code = 'seminar.watch_individual_multiplier' THEN p.price END) AS seminar_watch,\n    MAX(CASE WHEN p.code = 'seminar.interfere_teach_multiplier' THEN p.price END) AS seminar_interfere,\n    MAX(CASE WHEN p.code = 'seminar.discussing_lesson_multiplier' THEN p.price END) AS seminar_discuss,\n    MAX(CASE WHEN p.code = 'seminar.kamal_bonus' THEN p.price END) AS seminar_kamal,\n    MAX(CASE WHEN p.code = 'manha.student_multiplier' THEN p.price END) AS manha_student,\n    MAX(CASE WHEN p.code = 'manha.methodic_multiplier' THEN p.price END) AS manha_methodic,\n    MAX(CASE WHEN p.code = 'manha.taarif_hulia_bonus' THEN p.price END) AS manha_hulia1,\n    MAX(CASE WHEN p.code = 'manha.taarif_hulia2_bonus' THEN p.price END) AS manha_hulia2,\n    MAX(CASE WHEN p.code = 'manha.taarif_hulia3_bonus' THEN p.price END) AS manha_hulia3,\n    MAX(CASE WHEN p.code = 'manha.watched_lesson_multiplier' THEN p.price END) AS manha_watched,\n    MAX(CASE WHEN p.code = 'manha.discussing_lesson_multiplier' THEN p.price END) AS manha_discuss,\n    MAX(CASE WHEN p.code = 'manha.yalkut_lesson_multiplier' THEN p.price END) AS manha_yalkut,\n    MAX(CASE WHEN p.code = 'manha.help_taught_multiplier' THEN p.price END) AS manha_help,\n    MAX(CASE WHEN p.code = 'pds.watch_individual_multiplier' THEN p.price END) AS pds_watch,\n    MAX(CASE WHEN p.code = 'pds.interfere_teach_multiplier' THEN p.price END) AS pds_interfere,\n    MAX(CASE WHEN p.code = 'pds.discussing_lesson_multiplier' THEN p.price END) AS pds_discuss,\n    MAX(CASE WHEN p.code = 'kindergarten.student_multiplier' THEN p.price END) AS kinder_student,\n    MAX(CASE WHEN p.code = 'kindergarten.collective_watch_bonus' THEN p.price END) AS kinder_collective,\n    MAX(CASE WHEN p.code = 'special.student_multiplier' THEN p.price END) AS special_student,\n    MAX(CASE WHEN p.code = 'special.lesson_multiplier' THEN p.price END) AS special_lesson,\n    MAX(CASE WHEN p.code = 'special.phone_discussion_bonus' THEN p.price END) AS special_phone\n    FROM users u\n    LEFT JOIN price_by_user p ON p.userId = u.id\n    WHERE u.effective_id IS NULL\n    GROUP BY u.id"]);
        await queryRunner.query(`
            CREATE VIEW \`att_report_with_price\` AS
            SELECT r.id,
                r.user_id AS userId,
                r.teacherReferenceId,
                r.teacherTz,
                r.report_date AS reportDate,
                r.update_date AS updateDate,
                r.salary_report_id AS salaryReportId,
                r.salary_month AS salaryMonth,
                r.comment,
                r.year,
                r.createdAt,
                r.updatedAt,
                t.teacherTypeReferenceId,
                tt.\`key\` AS teacherTypeKey,
                -- Report fields needed for price explanation
                r.how_many_students AS howManyStudents,
                r.how_many_students_teached AS howManyStudentsTeached,
                r.how_many_students_watched AS howManyStudentsWatched,
                r.how_many_students_help_teached AS howManyStudentsHelpTeached,
                r.how_many_lessons AS howManyLessons,
                r.how_many_yalkut_lessons AS howManyYalkutLessons,
                r.how_many_discussing_lessons AS howManyDiscussingLessons,
                r.how_many_watched_lessons AS howManyWatchedLessons,
                r.how_many_watch_or_individual AS howManyWatchOrIndividual,
                r.how_many_teached_or_interfering AS howManyTeachedOrInterfering,
                r.how_many_methodic AS howManyMethodic,
                r.how_many_lessons_absence AS howManyLessonsAbsence,
                r.was_phone_discussing AS wasPhoneDiscussing,
                r.was_kamal AS wasKamal,
                r.was_collective_watch AS wasCollectiveWatch,
                r.is_taarif_hulia AS isTaarifHulia,
                r.is_taarif_hulia2 AS isTaarifHulia2,
                r.is_taarif_hulia3 AS isTaarifHulia3,
                -- Total calculated price (base + components, minimum 0)
                GREATEST(
                    0,
                    COALESCE(up.lesson_base, 0) + CASE
                        tt.\`key\`
                        WHEN 1 THEN -- SEMINAR_KITA
                        COALESCE(r.how_many_students * up.seminar_student, 0) + COALESCE(r.how_many_lessons * up.seminar_lesson, 0) + COALESCE(
                            r.how_many_discussing_lessons * r.how_many_students * up.seminar_discuss,
                            0
                        ) + COALESCE(
                            r.how_many_watch_or_individual * r.how_many_students * up.seminar_watch,
                            0
                        ) + COALESCE(
                            r.how_many_teached_or_interfering * r.how_many_students * up.seminar_interfere,
                            0
                        ) + COALESCE(
                            r.how_many_lessons_absence * up.seminar_lesson * -0.5,
                            0
                        ) + COALESCE(
                            r.was_kamal * r.how_many_students * up.seminar_kamal,
                            0
                        )
                        WHEN 3 THEN -- MANHA
                        COALESCE(
                            r.how_many_students_teached * up.manha_student,
                            0
                        ) + COALESCE(
                            r.how_many_students_help_teached * up.manha_help,
                            0
                        ) + COALESCE(r.how_many_yalkut_lessons * up.manha_yalkut, 0) + COALESCE(
                            r.how_many_discussing_lessons * up.manha_discuss,
                            0
                        ) + COALESCE(r.how_many_watched_lessons * up.manha_watched, 0) + COALESCE(r.how_many_methodic * up.manha_methodic, 0) + COALESCE(r.is_taarif_hulia * up.manha_hulia1, 0) + COALESCE(r.is_taarif_hulia2 * up.manha_hulia2, 0) + COALESCE(r.is_taarif_hulia3 * up.manha_hulia3, 0)
                        WHEN 5 THEN -- PDS
                        COALESCE(
                            r.how_many_discussing_lessons * up.pds_discuss,
                            0
                        ) + COALESCE(r.how_many_watch_or_individual * up.pds_watch, 0) + COALESCE(
                            r.how_many_teached_or_interfering * up.pds_interfere,
                            0
                        )
                        WHEN 6 THEN -- KINDERGARTEN
                        COALESCE(r.how_many_students * up.kinder_student, 0) + COALESCE(r.was_collective_watch * up.kinder_collective, 0)
                        WHEN 7 THEN -- SPECIAL_EDUCATION
                        COALESCE(
                            r.how_many_students_teached * up.special_student,
                            0
                        ) + COALESCE(
                            r.how_many_students_watched * up.special_student * 0.5,
                            0
                        ) + COALESCE(r.how_many_lessons * up.special_lesson, 0) + COALESCE(r.was_phone_discussing * up.special_phone, 0)
                        ELSE 0
                    END
                ) AS calculatedPrice
            FROM att_reports r
                INNER JOIN teachers t ON t.id = r.teacherReferenceId
                AND t.user_id = r.user_id
                INNER JOIN teacher_types tt ON tt.id = t.teacherTypeReferenceId
                AND tt.user_id = r.user_id
                INNER JOIN user_price_pivot up ON up.userId = r.user_id
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
        `, ["teacher_report_nra","VIEW","att_report_with_price","SELECT\n      r.id,\n      r.user_id AS userId,\n      r.teacherReferenceId,\n      r.teacherTz,\n      r.report_date AS reportDate,\n      r.update_date AS updateDate,\n      r.salary_report_id AS salaryReportId,\n      r.salary_month AS salaryMonth,\n      r.comment,\n      r.year,\n      r.createdAt,\n      r.updatedAt,\n      t.teacherTypeReferenceId,\n      tt.`key` AS teacherTypeKey,\n      \n      -- Report fields needed for price explanation\n      r.how_many_students AS howManyStudents,\n      r.how_many_students_teached AS howManyStudentsTeached,\n      r.how_many_students_watched AS howManyStudentsWatched,\n      r.how_many_students_help_teached AS howManyStudentsHelpTeached,\n      r.how_many_lessons AS howManyLessons,\n      r.how_many_yalkut_lessons AS howManyYalkutLessons,\n      r.how_many_discussing_lessons AS howManyDiscussingLessons,\n      r.how_many_watched_lessons AS howManyWatchedLessons,\n      r.how_many_watch_or_individual AS howManyWatchOrIndividual,\n      r.how_many_teached_or_interfering AS howManyTeachedOrInterfering,\n      r.how_many_methodic AS howManyMethodic,\n      r.how_many_lessons_absence AS howManyLessonsAbsence,\n      r.was_phone_discussing AS wasPhoneDiscussing,\n      r.was_kamal AS wasKamal,\n      r.was_collective_watch AS wasCollectiveWatch,\n      r.is_taarif_hulia AS isTaarifHulia,\n      r.is_taarif_hulia2 AS isTaarifHulia2,\n      r.is_taarif_hulia3 AS isTaarifHulia3,\n      \n      -- Total calculated price (base + components, minimum 0)\n      GREATEST(0,\n        COALESCE(up.lesson_base, 0) +\n        CASE tt.`key`\n          WHEN 1 THEN -- SEMINAR_KITA\n            COALESCE(r.how_many_students * up.seminar_student, 0) +\n            COALESCE(r.how_many_lessons * up.seminar_lesson, 0) +\n            COALESCE(r.how_many_discussing_lessons * r.how_many_students * up.seminar_discuss, 0) +\n            COALESCE(r.how_many_watch_or_individual * r.how_many_students * up.seminar_watch, 0) +\n            COALESCE(r.how_many_teached_or_interfering * r.how_many_students * up.seminar_interfere, 0) +\n            COALESCE(r.how_many_lessons_absence * up.seminar_lesson * -0.5, 0) +\n            COALESCE(r.was_kamal * r.how_many_students * up.seminar_kamal, 0)\n          WHEN 3 THEN -- MANHA\n            COALESCE(r.how_many_students_teached * up.manha_student, 0) +\n            COALESCE(r.how_many_students_help_teached * up.manha_help, 0) +\n            COALESCE(r.how_many_yalkut_lessons * up.manha_yalkut, 0) +\n            COALESCE(r.how_many_discussing_lessons * up.manha_discuss, 0) +\n            COALESCE(r.how_many_watched_lessons * up.manha_watched, 0) +\n            COALESCE(r.how_many_methodic * up.manha_methodic, 0) +\n            COALESCE(r.is_taarif_hulia * up.manha_hulia1, 0) +\n            COALESCE(r.is_taarif_hulia2 * up.manha_hulia2, 0) +\n            COALESCE(r.is_taarif_hulia3 * up.manha_hulia3, 0)\n          WHEN 5 THEN -- PDS\n            COALESCE(r.how_many_discussing_lessons * up.pds_discuss, 0) +\n            COALESCE(r.how_many_watch_or_individual * up.pds_watch, 0) +\n            COALESCE(r.how_many_teached_or_interfering * up.pds_interfere, 0)\n          WHEN 6 THEN -- KINDERGARTEN\n            COALESCE(r.how_many_students * up.kinder_student, 0) +\n            COALESCE(r.was_collective_watch * up.kinder_collective, 0)\n          WHEN 7 THEN -- SPECIAL_EDUCATION\n            COALESCE(r.how_many_students_teached * up.special_student, 0) +\n            COALESCE(r.how_many_students_watched * up.special_student * 0.5, 0) +\n            COALESCE(r.how_many_lessons * up.special_lesson, 0) +\n            COALESCE(r.was_phone_discussing * up.special_phone, 0)\n          ELSE 0\n        END\n      ) AS calculatedPrice\n      \n    FROM att_reports r\n    INNER JOIN teachers t ON t.id = r.teacherReferenceId AND t.user_id = r.user_id\n    INNER JOIN teacher_types tt ON tt.id = t.teacherTypeReferenceId AND tt.user_id = r.user_id\n    INNER JOIN user_price_pivot up ON up.userId = r.user_id"]);
    }

}
