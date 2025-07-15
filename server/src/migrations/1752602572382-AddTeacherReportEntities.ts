import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeacherReportEntities1752602572382 implements MigrationInterface {
  name = 'AddTeacherReportEntities1752602572382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add new fields to existing teachers table
    await queryRunner.query(`
      ALTER TABLE \`teachers\` 
      ADD COLUMN \`phone\` varchar(50) NULL,
      ADD COLUMN \`email\` varchar(255) NULL,
      ADD COLUMN \`school\` varchar(255) NULL,
      ADD COLUMN \`teacher_type_id\` int NULL,
      ADD COLUMN \`price\` decimal(8,2) NULL,
      ADD COLUMN \`training_teacher\` varchar(255) NULL,
      ADD COLUMN \`special_question\` int NULL,
      ADD COLUMN \`student_count\` int NULL
    `);

    // Add new fields to existing students table
    await queryRunner.query(`
      ALTER TABLE \`students\` 
      ADD COLUMN \`phone\` varchar(50) NULL,
      ADD COLUMN \`email\` varchar(255) NULL
    `);

    // Create teacher_types table
    await queryRunner.query(`
      CREATE TABLE \`teacher_types\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`key\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`teacher_types_user_id_idx\` (\`user_id\`),
        INDEX \`teacher_types_key_idx\` (\`key\`)
      ) ENGINE = InnoDB
    `);

    // Create att_types table
    await queryRunner.query(`
      CREATE TABLE \`att_types\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`att_types_user_id_idx\` (\`user_id\`),
        INDEX \`att_types_name_idx\` (\`name\`)
      ) ENGINE = InnoDB
    `);

    // Create prices table
    await queryRunner.query(`
      CREATE TABLE \`prices\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`key\` int NOT NULL,
        \`price\` decimal(8,2) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`prices_user_id_idx\` (\`user_id\`),
        INDEX \`prices_key_idx\` (\`key\`)
      ) ENGINE = InnoDB
    `);

    // Create question_types table
    await queryRunner.query(`
      CREATE TABLE \`question_types\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`key\` int NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`question_types_user_id_idx\` (\`user_id\`),
        INDEX \`question_types_key_idx\` (\`key\`)
      ) ENGINE = InnoDB
    `);

    // Create questions table
    await queryRunner.query(`
      CREATE TABLE \`questions\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`teacher_type_id\` int NULL,
        \`question_type_id\` int NULL,
        \`content\` text NOT NULL,
        \`allowed_digits\` varchar(255) NULL,
        \`is_standalone\` tinyint NOT NULL DEFAULT 0,
        \`start_date\` date NULL,
        \`end_date\` date NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`questions_user_id_idx\` (\`user_id\`),
        INDEX \`questions_teacher_type_id_idx\` (\`teacher_type_id\`),
        INDEX \`questions_question_type_id_idx\` (\`question_type_id\`)
      ) ENGINE = InnoDB
    `);

    // Create working_dates table
    await queryRunner.query(`
      CREATE TABLE \`working_dates\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`teacher_type_id\` int NULL,
        \`working_date\` date NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`working_dates_user_id_idx\` (\`user_id\`),
        INDEX \`working_dates_teacher_type_id_idx\` (\`teacher_type_id\`),
        INDEX \`working_dates_working_date_idx\` (\`working_date\`)
      ) ENGINE = InnoDB
    `);

    // Create salary_reports table
    await queryRunner.query(`
      CREATE TABLE \`salary_reports\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`ids\` text NULL,
        \`date\` datetime NOT NULL,
        \`name\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`salary_reports_user_id_idx\` (\`user_id\`),
        INDEX \`salary_reports_date_idx\` (\`date\`)
      ) ENGINE = InnoDB
    `);

    // Create att_reports table (core reporting table)
    await queryRunner.query(`
      CREATE TABLE \`att_reports\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`teacher_id\` int NOT NULL,
        \`report_date\` date NOT NULL,
        \`update_date\` datetime NULL,
        \`year\` int NULL,
        \`is_confirmed\` tinyint NOT NULL DEFAULT 0,
        \`salary_report\` int NULL,
        \`salary_month\` int NULL,
        \`comment\` text NULL,
        \`how_many_students\` int NULL,
        \`how_many_methodic\` int NULL,
        \`four_last_digits_of_teacher_phone\` varchar(4) NULL,
        \`teached_student_tz\` text NULL,
        \`how_many_yalkut_lessons\` int NULL,
        \`how_many_discussing_lessons\` int NULL,
        \`how_many_students_help_teached\` int NULL,
        \`how_many_lessons_absence\` int NULL,
        \`how_many_watched_lessons\` int NULL,
        \`was_discussing\` tinyint NOT NULL DEFAULT 0,
        \`was_kamal\` tinyint NOT NULL DEFAULT 0,
        \`was_students_good\` tinyint NOT NULL DEFAULT 0,
        \`was_students_enter_on_time\` tinyint NOT NULL DEFAULT 0,
        \`was_students_exit_on_time\` tinyint NOT NULL DEFAULT 0,
        \`activity_type\` int NULL,
        \`teacher_to_report_for\` int NULL,
        \`was_collective_watch\` tinyint NOT NULL DEFAULT 0,
        \`is_taarif_hulia\` tinyint NOT NULL DEFAULT 0,
        \`is_taarif_hulia2\` tinyint NOT NULL DEFAULT 0,
        \`is_taarif_hulia3\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`att_reports_user_id_idx\` (\`user_id\`),
        INDEX \`att_reports_teacher_id_idx\` (\`teacher_id\`),
        INDEX \`att_reports_report_date_idx\` (\`report_date\`),
        INDEX \`att_reports_year_idx\` (\`year\`)
      ) ENGINE = InnoDB
    `);

    // Create answers table
    await queryRunner.query(`
      CREATE TABLE \`answers\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`user_id\` int NOT NULL,
        \`teacher_id\` int NOT NULL,
        \`question_id\` int NOT NULL,
        \`report_id\` int NULL,
        \`answer\` int NOT NULL,
        \`answer_date\` date NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`answers_user_id_idx\` (\`user_id\`),
        INDEX \`answers_teacher_id_idx\` (\`teacher_id\`),
        INDEX \`answers_question_id_idx\` (\`question_id\`),
        INDEX \`answers_report_id_idx\` (\`report_id\`),
        INDEX \`answers_answer_date_idx\` (\`answer_date\`)
      ) ENGINE = InnoDB
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE \`teacher_types\` 
      ADD CONSTRAINT \`FK_teacher_types_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`att_types\` 
      ADD CONSTRAINT \`FK_att_types_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`prices\` 
      ADD CONSTRAINT \`FK_prices_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`question_types\` 
      ADD CONSTRAINT \`FK_question_types_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`questions\` 
      ADD CONSTRAINT \`FK_questions_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`questions\` 
      ADD CONSTRAINT \`FK_questions_question_type\` FOREIGN KEY (\`question_type_id\`) REFERENCES \`question_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`working_dates\` 
      ADD CONSTRAINT \`FK_working_dates_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`salary_reports\` 
      ADD CONSTRAINT \`FK_salary_reports_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`att_reports\` 
      ADD CONSTRAINT \`FK_att_reports_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`att_reports\` 
      ADD CONSTRAINT \`FK_att_reports_teacher\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`att_reports\` 
      ADD CONSTRAINT \`FK_att_reports_att_type\` FOREIGN KEY (\`activity_type\`) REFERENCES \`att_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`answers\` 
      ADD CONSTRAINT \`FK_answers_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`answers\` 
      ADD CONSTRAINT \`FK_answers_teacher\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`answers\` 
      ADD CONSTRAINT \`FK_answers_question\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`answers\` 
      ADD CONSTRAINT \`FK_answers_report\` FOREIGN KEY (\`report_id\`) REFERENCES \`att_reports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_answers_report\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_answers_question\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_answers_teacher\``);
    await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_answers_user\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_att_reports_att_type\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_att_reports_teacher\``);
    await queryRunner.query(`ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_att_reports_user\``);
    await queryRunner.query(`ALTER TABLE \`salary_reports\` DROP FOREIGN KEY \`FK_salary_reports_user\``);
    await queryRunner.query(`ALTER TABLE \`working_dates\` DROP FOREIGN KEY \`FK_working_dates_user\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_questions_question_type\``);
    await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_questions_user\``);
    await queryRunner.query(`ALTER TABLE \`question_types\` DROP FOREIGN KEY \`FK_question_types_user\``);
    await queryRunner.query(`ALTER TABLE \`prices\` DROP FOREIGN KEY \`FK_prices_user\``);
    await queryRunner.query(`ALTER TABLE \`att_types\` DROP FOREIGN KEY \`FK_att_types_user\``);
    await queryRunner.query(`ALTER TABLE \`teacher_types\` DROP FOREIGN KEY \`FK_teacher_types_user\``);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE \`answers\``);
    await queryRunner.query(`DROP TABLE \`att_reports\``);
    await queryRunner.query(`DROP TABLE \`salary_reports\``);
    await queryRunner.query(`DROP TABLE \`working_dates\``);
    await queryRunner.query(`DROP TABLE \`questions\``);
    await queryRunner.query(`DROP TABLE \`question_types\``);
    await queryRunner.query(`DROP TABLE \`prices\``);
    await queryRunner.query(`DROP TABLE \`att_types\``);
    await queryRunner.query(`DROP TABLE \`teacher_types\``);

    // Remove added columns from existing tables
    await queryRunner.query(`
      ALTER TABLE \`students\` 
      DROP COLUMN \`email\`,
      DROP COLUMN \`phone\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`teachers\` 
      DROP COLUMN \`student_count\`,
      DROP COLUMN \`special_question\`,
      DROP COLUMN \`training_teacher\`,
      DROP COLUMN \`price\`,
      DROP COLUMN \`teacher_type_id\`,
      DROP COLUMN \`school\`,
      DROP COLUMN \`email\`,
      DROP COLUMN \`phone\`
    `);
  }
}