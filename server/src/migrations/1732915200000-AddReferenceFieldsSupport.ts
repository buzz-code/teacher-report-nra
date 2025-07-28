import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferenceFieldsSupport1732915200000 implements MigrationInterface {
  name = 'AddReferenceFieldsSupport1732915200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add key field to att_types table
    await queryRunner.query(`ALTER TABLE \`att_types\` ADD \`key\` int NOT NULL`);
    await queryRunner.query(`CREATE INDEX \`att_types_key_idx\` ON \`att_types\` (\`key\`)`);

    // Add dual fields to answers table
    await queryRunner.query(`ALTER TABLE \`answers\` ADD \`teacherTz\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`answers\` ADD \`teacherReferenceId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`answers\` ADD \`questionReferenceId\` int NULL`);

    // Drop old columns and create new indexes
    await queryRunner.query(`DROP INDEX \`answers_teacher_id_idx\` ON \`answers\``);
    await queryRunner.query(`DROP INDEX \`answers_question_id_idx\` ON \`answers\``);
    await queryRunner.query(`CREATE INDEX \`answers_teacher_id_idx\` ON \`answers\` (\`teacherReferenceId\`)`);
    await queryRunner.query(`CREATE INDEX \`answers_question_id_idx\` ON \`answers\` (\`questionReferenceId\`)`);

    // Add dual fields to questions table
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`teacherTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`teacherTypeReferenceId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`questionTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`questionTypeReferenceId\` int NULL`);

    // Drop old columns and create new indexes
    await queryRunner.query(`DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`DROP INDEX \`questions_question_type_id_idx\` ON \`questions\``);
    await queryRunner.query(
      `CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacherTypeReferenceId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`questions_question_type_id_idx\` ON \`questions\` (\`questionTypeReferenceId\`)`,
    );

    // Add dual fields to teachers table
    await queryRunner.query(`ALTER TABLE \`teachers\` ADD \`teacherTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`teachers\` ADD \`teacherTypeReferenceId\` int NULL`);
    await queryRunner.query(
      `CREATE INDEX \`teachers_teacher_type_id_idx\` ON \`teachers\` (\`teacherTypeReferenceId\`)`,
    );

    // Add dual fields to att_reports table
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`teacherTz\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`teacherReferenceId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`activityTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`activityTypeReferenceId\` int NULL`);

    // Drop old indexes and create new ones
    await queryRunner.query(`DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\``);
    await queryRunner.query(`CREATE INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\` (\`teacherReferenceId\`)`);
    await queryRunner.query(
      `CREATE INDEX \`att_reports_activity_type_idx\` ON \`att_reports\` (\`activityTypeReferenceId\`)`,
    );

    // Add dual fields to working_dates table
    await queryRunner.query(`ALTER TABLE \`working_dates\` ADD \`teacherTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`working_dates\` ADD \`teacherTypeReferenceId\` int NULL`);

    // Drop old index and create new one
    await queryRunner.query(`DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\``);
    await queryRunner.query(
      `CREATE INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\` (\`teacherTypeReferenceId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse all changes - remove added columns and indexes, restore old ones

    // Revert working_dates
    await queryRunner.query(`DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\``);
    await queryRunner.query(
      `CREATE INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\` (\`teacher_type_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`working_dates\` DROP COLUMN \`teacherTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`working_dates\` DROP COLUMN \`teacherTypeKey\``);

    // Revert att_reports
    await queryRunner.query(`DROP INDEX \`att_reports_activity_type_idx\` ON \`att_reports\``);
    await queryRunner.query(`DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\``);
    await queryRunner.query(`CREATE INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\` (\`teacher_id\`)`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`activityTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`activityTypeKey\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`teacherReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`teacherTz\``);

    // Revert teachers
    await queryRunner.query(`DROP INDEX \`teachers_teacher_type_id_idx\` ON \`teachers\``);
    await queryRunner.query(`ALTER TABLE \`teachers\` DROP COLUMN \`teacherTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`teachers\` DROP COLUMN \`teacherTypeKey\``);

    // Revert questions
    await queryRunner.query(`DROP INDEX \`questions_question_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`CREATE INDEX \`questions_question_type_id_idx\` ON \`questions\` (\`question_type_id\`)`);
    await queryRunner.query(`CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacher_type_id\`)`);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`questionTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`questionTypeKey\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeKey\``);

    // Revert answers
    await queryRunner.query(`DROP INDEX \`answers_question_id_idx\` ON \`answers\``);
    await queryRunner.query(`DROP INDEX \`answers_teacher_id_idx\` ON \`answers\``);
    await queryRunner.query(`CREATE INDEX \`answers_question_id_idx\` ON \`answers\` (\`question_id\`)`);
    await queryRunner.query(`CREATE INDEX \`answers_teacher_id_idx\` ON \`answers\` (\`teacher_id\`)`);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`questionReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`teacherReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`teacherTz\``);

    // Revert att_types
    await queryRunner.query(`DROP INDEX \`att_types_key_idx\` ON \`att_types\``);
    await queryRunner.query(`ALTER TABLE \`att_types\` DROP COLUMN \`key\``);
  }
}
