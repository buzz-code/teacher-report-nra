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

    // Migrate existing data from old columns to new columns
    await queryRunner.query(
      `UPDATE \`answers\` SET \`teacherReferenceId\` = \`teacher_id\` WHERE \`teacher_id\` IS NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE \`answers\` SET \`questionReferenceId\` = \`question_id\` WHERE \`question_id\` IS NOT NULL`,
    );

    // Drop foreign key constraints first
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_695b91293aa902ae6e1715a1ce6\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_677120094cf6d3f12df0b9dc5d3\``);

    // Drop old indexes and columns
    await queryRunner.query(`DROP INDEX \`answers_teacher_id_idx\` ON \`answers\``);
    await queryRunner.query(`DROP INDEX \`answers_question_id_idx\` ON \`answers\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`teacher_id\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`question_id\``);

    // Create new indexes and foreign key constraints
    await queryRunner.query(`CREATE INDEX \`answers_teacher_id_idx\` ON \`answers\` (\`teacherReferenceId\`)`);
    await queryRunner.query(`CREATE INDEX \`answers_question_id_idx\` ON \`answers\` (\`questionReferenceId\`)`);
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_answers_teacher_reference\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_answers_question_reference\` FOREIGN KEY (\`questionReferenceId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Add dual fields to questions table
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`teacherTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`teacherTypeReferenceId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`questionTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`questionTypeReferenceId\` int NULL`);

    // Migrate existing data from old columns to new columns
    await queryRunner.query(
      `UPDATE \`questions\` SET \`teacherTypeReferenceId\` = \`teacher_type_id\` WHERE \`teacher_type_id\` IS NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE \`questions\` SET \`questionTypeReferenceId\` = \`question_type_id\` WHERE \`question_type_id\` IS NOT NULL`,
    );

    // Drop old columns and create new indexes
    await queryRunner.query(`DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`DROP INDEX \`questions_question_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`teacher_type_id\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`question_type_id\``);
    await queryRunner.query(
      `CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacherTypeReferenceId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`questions_question_type_id_idx\` ON \`questions\` (\`questionTypeReferenceId\`)`,
    );

    // Add dual fields to teachers table
    await queryRunner.query(`ALTER TABLE \`teachers\` ADD \`teacherTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`teachers\` ADD \`teacherTypeReferenceId\` int NULL`);

    // Migrate existing data from old column to new column
    await queryRunner.query(
      `UPDATE \`teachers\` SET \`teacherTypeReferenceId\` = \`teacher_type_id\` WHERE \`teacher_type_id\` IS NOT NULL`,
    );

    // Drop old column and create new index
    await queryRunner.query(`ALTER TABLE \`teachers\` DROP COLUMN \`teacher_type_id\``);
    await queryRunner.query(
      `CREATE INDEX \`teachers_teacher_type_id_idx\` ON \`teachers\` (\`teacherTypeReferenceId\`)`,
    );

    // Add dual fields to att_reports table
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`teacherTz\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`teacherReferenceId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`activityTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`activityTypeReferenceId\` int NULL`);

    // Migrate existing data from old columns to new columns
    await queryRunner.query(
      `UPDATE \`att_reports\` SET \`teacherReferenceId\` = \`teacher_id\` WHERE \`teacher_id\` IS NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE \`att_reports\` SET \`activityTypeReferenceId\` = \`activity_type\` WHERE \`activity_type\` IS NOT NULL`,
    );

    // Drop foreign key constraints first
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_bf3281887aea53866eaa7f6b6c0\``);

    // Drop old indexes and columns, create new ones
    await queryRunner.query(`DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`teacher_id\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`activity_type\``);

    // Create new indexes and foreign key constraints
    await queryRunner.query(`CREATE INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\` (\`teacherReferenceId\`)`);
    await queryRunner.query(
      `CREATE INDEX \`att_reports_activity_type_idx\` ON \`att_reports\` (\`activityTypeReferenceId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`att_reports\` ADD CONSTRAINT \`FK_att_reports_teacher_reference\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Add dual fields to working_dates table
    await queryRunner.query(`ALTER TABLE \`working_dates\` ADD \`teacherTypeKey\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`working_dates\` ADD \`teacherTypeReferenceId\` int NULL`);

    // Migrate existing data from old column to new column
    await queryRunner.query(
      `UPDATE \`working_dates\` SET \`teacherTypeReferenceId\` = \`teacher_type_id\` WHERE \`teacher_type_id\` IS NOT NULL`,
    );

    // Drop old index and column, create new one
    await queryRunner.query(`DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\``);
    await queryRunner.query(`ALTER TABLE \`working_dates\` DROP COLUMN \`teacher_type_id\``);
    await queryRunner.query(
      `CREATE INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\` (\`teacherTypeReferenceId\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse all changes - remove added columns and indexes, restore old ones

    // Revert working_dates
    await queryRunner.query(`DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\``);
    await queryRunner.query(`ALTER TABLE \`working_dates\` ADD \`teacher_type_id\` int NULL`);
    await queryRunner.query(
      `UPDATE \`working_dates\` SET \`teacher_type_id\` = \`teacherTypeReferenceId\` WHERE \`teacherTypeReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\` (\`teacher_type_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`working_dates\` DROP COLUMN \`teacherTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`working_dates\` DROP COLUMN \`teacherTypeKey\``);

    // Revert att_reports
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_att_reports_teacher_reference\``);
    await queryRunner.query(`DROP INDEX \`att_reports_activity_type_idx\` ON \`att_reports\``);
    await queryRunner.query(`DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`teacher_id\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`activity_type\` int NULL`);
    await queryRunner.query(
      `UPDATE \`att_reports\` SET \`teacher_id\` = \`teacherReferenceId\` WHERE \`teacherReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE \`att_reports\` SET \`activity_type\` = \`activityTypeReferenceId\` WHERE \`activityTypeReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(`CREATE INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\` (\`teacher_id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`att_reports\` ADD CONSTRAINT \`FK_bf3281887aea53866eaa7f6b6c0\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`activityTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`activityTypeKey\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`teacherReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`teacherTz\``);

    // Revert teachers
    await queryRunner.query(`DROP INDEX \`teachers_teacher_type_id_idx\` ON \`teachers\``);
    await queryRunner.query(`ALTER TABLE \`teachers\` ADD \`teacher_type_id\` int NULL`);
    await queryRunner.query(
      `UPDATE \`teachers\` SET \`teacher_type_id\` = \`teacherTypeReferenceId\` WHERE \`teacherTypeReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`teachers\` DROP COLUMN \`teacherTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`teachers\` DROP COLUMN \`teacherTypeKey\``);

    // Revert questions
    await queryRunner.query(`DROP INDEX \`questions_question_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\``);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`teacher_type_id\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`questions\` ADD \`question_type_id\` int NULL`);
    await queryRunner.query(
      `UPDATE \`questions\` SET \`teacher_type_id\` = \`teacherTypeReferenceId\` WHERE \`teacherTypeReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE \`questions\` SET \`question_type_id\` = \`questionTypeReferenceId\` WHERE \`questionTypeReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(`CREATE INDEX \`questions_question_type_id_idx\` ON \`questions\` (\`question_type_id\`)`);
    await queryRunner.query(`CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacher_type_id\`)`);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`questionTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`questionTypeKey\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeKey\``);

    // Revert answers
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_answers_teacher_reference\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_answers_question_reference\``);
    await queryRunner.query(`DROP INDEX \`answers_question_id_idx\` ON \`answers\``);
    await queryRunner.query(`DROP INDEX \`answers_teacher_id_idx\` ON \`answers\``);
    await queryRunner.query(`ALTER TABLE \`answers\` ADD \`teacher_id\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`answers\` ADD \`question_id\` int NULL`);
    await queryRunner.query(
      `UPDATE \`answers\` SET \`teacher_id\` = \`teacherReferenceId\` WHERE \`teacherReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE \`answers\` SET \`question_id\` = \`questionReferenceId\` WHERE \`questionReferenceId\` IS NOT NULL`,
    );
    await queryRunner.query(`CREATE INDEX \`answers_question_id_idx\` ON \`answers\` (\`question_id\`)`);
    await queryRunner.query(`CREATE INDEX \`answers_teacher_id_idx\` ON \`answers\` (\`teacher_id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_695b91293aa902ae6e1715a1ce6\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_677120094cf6d3f12df0b9dc5d3\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`questionReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`teacherReferenceId\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP COLUMN \`teacherTz\``);

    // Revert att_types
    await queryRunner.query(`DROP INDEX \`att_types_key_idx\` ON \`att_types\``);
    await queryRunner.query(`ALTER TABLE \`att_types\` DROP COLUMN \`key\``);
  }
}
