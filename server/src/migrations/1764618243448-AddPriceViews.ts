import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceViews1764618243448 implements MigrationInterface {
    name = 'AddPriceViews1764618243448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create user_price_pivot first (dependency of att_report_with_price)
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

        // Create att_report_with_price (depends on user_price_pivot)
        await queryRunner.query(`
            CREATE VIEW \`att_report_with_price\` AS
            SELECT r.id,
                r.user_id AS userId,
                r.teacherReferenceId,
                r.teacherTz,
                r.report_date AS reportDate,
                r.salary_report_id AS salaryReportId,
                r.year,
                r.createdAt,
                r.updatedAt,
                t.teacherTypeReferenceId,
                tt.\`key\` AS teacherTypeKey,
                -- Total calculated price (base + components, minimum 0)
                GREATEST(
                    0,
                    COALESCE(up.lesson_base, 0) + CASE
                        tt.\`key\`
                        WHEN 1 THEN -- SEMINAR_KITA
                        COALESCE(r.how_many_students * up.seminar_student, 0) + COALESCE(r.how_many_lessons * up.seminar_lesson, 0) + COALESCE(
                            r.how_many_discussing_lessons * up.seminar_discuss,
                            0
                        ) + COALESCE(
                            r.how_many_watch_or_individual * up.seminar_watch,
                            0
                        ) + COALESCE(
                            r.how_many_teached_or_interfering * up.seminar_interfere,
                            0
                        ) + COALESCE(
                            r.how_many_lessons_absence * up.seminar_lesson * -0.5,
                            0
                        ) + COALESCE(r.was_kamal * up.seminar_kamal, 0)
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
        `, ["teacher_report_nra","VIEW","att_report_with_price","SELECT\n      r.id,\n      r.user_id AS userId,\n      r.teacherReferenceId,\n      r.teacherTz,\n      r.report_date AS reportDate,\n      r.salary_report_id AS salaryReportId,\n      r.year,\n      r.createdAt,\n      r.updatedAt,\n      t.teacherTypeReferenceId,\n      tt.`key` AS teacherTypeKey,\n      \n      -- Total calculated price (base + components, minimum 0)\n      GREATEST(0,\n        COALESCE(up.lesson_base, 0) +\n        CASE tt.`key`\n          WHEN 1 THEN -- SEMINAR_KITA\n            COALESCE(r.how_many_students * up.seminar_student, 0) +\n            COALESCE(r.how_many_lessons * up.seminar_lesson, 0) +\n            COALESCE(r.how_many_discussing_lessons * up.seminar_discuss, 0) +\n            COALESCE(r.how_many_watch_or_individual * up.seminar_watch, 0) +\n            COALESCE(r.how_many_teached_or_interfering * up.seminar_interfere, 0) +\n            COALESCE(r.how_many_lessons_absence * up.seminar_lesson * -0.5, 0) +\n            COALESCE(r.was_kamal * up.seminar_kamal, 0)\n          WHEN 3 THEN -- MANHA\n            COALESCE(r.how_many_students_teached * up.manha_student, 0) +\n            COALESCE(r.how_many_students_help_teached * up.manha_help, 0) +\n            COALESCE(r.how_many_yalkut_lessons * up.manha_yalkut, 0) +\n            COALESCE(r.how_many_discussing_lessons * up.manha_discuss, 0) +\n            COALESCE(r.how_many_watched_lessons * up.manha_watched, 0) +\n            COALESCE(r.how_many_methodic * up.manha_methodic, 0) +\n            COALESCE(r.is_taarif_hulia * up.manha_hulia1, 0) +\n            COALESCE(r.is_taarif_hulia2 * up.manha_hulia2, 0) +\n            COALESCE(r.is_taarif_hulia3 * up.manha_hulia3, 0)\n          WHEN 5 THEN -- PDS\n            COALESCE(r.how_many_discussing_lessons * up.pds_discuss, 0) +\n            COALESCE(r.how_many_watch_or_individual * up.pds_watch, 0) +\n            COALESCE(r.how_many_teached_or_interfering * up.pds_interfere, 0)\n          WHEN 6 THEN -- KINDERGARTEN\n            COALESCE(r.how_many_students * up.kinder_student, 0) +\n            COALESCE(r.was_collective_watch * up.kinder_collective, 0)\n          WHEN 7 THEN -- SPECIAL_EDUCATION\n            COALESCE(r.how_many_students_teached * up.special_student, 0) +\n            COALESCE(r.how_many_students_watched * up.special_student * 0.5, 0) +\n            COALESCE(r.how_many_lessons * up.special_lesson, 0) +\n            COALESCE(r.was_phone_discussing * up.special_phone, 0)\n          ELSE 0\n        END\n      ) AS calculatedPrice\n      \n    FROM att_reports r\n    INNER JOIN teachers t ON t.id = r.teacherReferenceId AND t.user_id = r.user_id\n    INNER JOIN teacher_types tt ON tt.id = t.teacherTypeReferenceId AND tt.user_id = r.user_id\n    INNER JOIN user_price_pivot up ON up.userId = r.user_id"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop att_report_with_price first (depends on user_price_pivot)
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","att_report_with_price","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`att_report_with_price\`
        `);

        // Then drop user_price_pivot
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","user_price_pivot","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`user_price_pivot\`
        `);
    }

}
