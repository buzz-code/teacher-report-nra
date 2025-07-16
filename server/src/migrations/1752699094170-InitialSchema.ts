import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1752699094170 implements MigrationInterface {
    name = 'InitialSchema1752699094170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`import_file\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`fileName\` varchar(255) NOT NULL,
                \`fileSource\` varchar(255) NOT NULL,
                \`entityIds\` text NOT NULL,
                \`entityName\` varchar(255) NOT NULL,
                \`fullSuccess\` tinyint NULL,
                \`response\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`image\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`imageTarget\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`fileDataSrc\` mediumtext NOT NULL,
                \`fileDataTitle\` text NOT NULL,
                UNIQUE INDEX \`IDX_35596848f8bb8f7b5ec5fcf9e0\` (\`userId\`, \`imageTarget\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`mail_address\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`alias\` varchar(255) NOT NULL,
                \`entity\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_10d2242b0e45f6add0b4269cbf\` (\`userId\`, \`entity\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`audit_log\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`entityId\` int NOT NULL,
                \`entityName\` varchar(255) NOT NULL,
                \`operation\` varchar(255) NOT NULL,
                \`entityData\` text NOT NULL,
                \`isReverted\` tinyint NOT NULL DEFAULT 0,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`page\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`description\` varchar(255) NOT NULL,
                \`value\` longtext NOT NULL,
                \`order\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`payment_track\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`description\` longtext NOT NULL,
                \`monthlyPrice\` int NOT NULL,
                \`annualPrice\` int NOT NULL,
                \`studentNumberLimit\` int NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`recieved_mail\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`mailData\` text NOT NULL,
                \`from\` varchar(255) NOT NULL,
                \`to\` varchar(255) NOT NULL,
                \`subject\` text NULL,
                \`body\` text NULL,
                \`entityName\` varchar(255) NOT NULL,
                \`importFileIds\` text NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`texts\` (
                \`id\` int UNSIGNED NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(100) NOT NULL,
                \`description\` varchar(500) NOT NULL,
                \`value\` varchar(10000) NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`texts_user_id_name_idx\` (\`user_id\`, \`name\`),
                INDEX \`texts_name_idx\` (\`name\`),
                INDEX \`texts_users_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(500) NOT NULL,
                \`email\` varchar(500) NULL,
                \`password\` varchar(500) NULL,
                \`phone_number\` varchar(11) NULL,
                \`active\` tinyint NULL,
                \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`effective_id\` int NULL,
                \`permissions\` text NULL,
                \`additionalData\` text NULL,
                \`userInfo\` text NULL,
                \`isPaid\` tinyint NOT NULL DEFAULT 0,
                \`paymentMethod\` varchar(255) NULL,
                \`mailAddressAlias\` varchar(255) NULL,
                \`mailAddressTitle\` varchar(255) NULL,
                \`paymentTrackId\` int NULL,
                \`bccAddress\` varchar(255) NULL,
                INDEX \`user_phone_number_idx\` (\`phone_number\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`yemot_call\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`userId\` int NOT NULL,
                \`apiCallId\` varchar(255) NOT NULL,
                \`phone\` varchar(255) NOT NULL,
                \`history\` mediumtext NOT NULL,
                \`currentStep\` varchar(255) NOT NULL,
                \`data\` text NULL,
                \`isOpen\` tinyint NOT NULL,
                \`hasError\` tinyint NOT NULL DEFAULT 0,
                \`errorMessage\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`yemot_call_api_call_id_idx\` (\`apiCallId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`teachers\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`own_user_id\` int NULL,
                \`tz\` varchar(9) NULL,
                \`name\` varchar(255) NOT NULL,
                \`phone\` varchar(50) NULL,
                \`email\` varchar(255) NULL,
                \`school\` varchar(255) NULL,
                \`teacher_type_id\` int NULL,
                \`price\` decimal(8, 2) NULL,
                \`training_teacher\` varchar(255) NULL,
                \`special_question\` int NULL,
                \`student_count\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`teachers_own_user_id_idx\` (\`own_user_id\`),
                INDEX \`teachers_name_idx\` (\`name\`),
                INDEX \`teachers_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`question_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`key\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`question_types_key_idx\` (\`key\`),
                INDEX \`question_types_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
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
                INDEX \`questions_question_type_id_idx\` (\`question_type_id\`),
                INDEX \`questions_teacher_type_id_idx\` (\`teacher_type_id\`),
                INDEX \`questions_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`att_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`att_types_name_idx\` (\`name\`),
                INDEX \`att_types_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
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
                INDEX \`att_reports_year_idx\` (\`year\`),
                INDEX \`att_reports_report_date_idx\` (\`report_date\`),
                INDEX \`att_reports_teacher_id_idx\` (\`teacher_id\`),
                INDEX \`att_reports_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
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
                INDEX \`answers_answer_date_idx\` (\`answer_date\`),
                INDEX \`answers_report_id_idx\` (\`report_id\`),
                INDEX \`answers_question_id_idx\` (\`question_id\`),
                INDEX \`answers_teacher_id_idx\` (\`teacher_id\`),
                INDEX \`answers_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`key\` int NOT NULL,
                \`description\` text NULL,
                \`year\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`event_types_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`students\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`tz\` varchar(255) NOT NULL,
                \`name\` varchar(510) NOT NULL,
                \`address\` text NULL,
                \`motherName\` varchar(255) NULL,
                \`motherContact\` varchar(255) NULL,
                \`fatherName\` varchar(255) NULL,
                \`fatherContact\` varchar(255) NULL,
                \`motherPreviousName\` varchar(255) NULL,
                \`phone\` varchar(50) NULL,
                \`email\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`students_tz_idx\` (\`tz\`),
                INDEX \`students_name_idx\` (\`name\`),
                INDEX \`students_user_id_idx\` (\`user_id\`),
                UNIQUE INDEX \`IDX_792054225739143030d210a629\` (\`user_id\`, \`tz\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_notes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`eventReferenceId\` int NOT NULL,
                \`authorReferenceId\` int NULL,
                \`noteText\` text NOT NULL,
                \`year\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`event_notes_user_id_idx\` (\`user_id\`),
                INDEX \`event_notes_author_id_idx\` (\`authorReferenceId\`),
                INDEX \`event_notes_event_id_idx\` (\`eventReferenceId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`gifts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`key\` int NOT NULL,
                \`description\` text NULL,
                \`year\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`gifts_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`event_gifts\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`eventReferenceId\` int NOT NULL,
                \`giftKey\` int NULL,
                \`giftReferenceId\` int NOT NULL,
                \`year\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`event_gifts_user_id_idx\` (\`user_id\`),
                INDEX \`event_gifts_gift_id_idx\` (\`giftReferenceId\`),
                INDEX \`event_gifts_event_id_idx\` (\`eventReferenceId\`),
                UNIQUE INDEX \`IDX_49ecdf64dd02d36d7423b04708\` (\`eventReferenceId\`, \`giftReferenceId\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`level_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`key\` int NOT NULL,
                \`description\` text NULL,
                \`year\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`level_types_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`classes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`key\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`gradeLevel\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`classes_name_idx\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`student_classes\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`year\` int NULL,
                \`studentTz\` varchar(255) NULL,
                \`studentReferenceId\` int NULL,
                \`classKey\` int NULL,
                \`classReferenceId\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`student_classes_class_idx\` (\`classReferenceId\`),
                INDEX \`student_classes_student_idx\` (\`studentReferenceId\`),
                INDEX \`student_classes_user_id_idx\` (\`user_id\`),
                UNIQUE INDEX \`IDX_1a74fabb33731a4f123b7671f9\` (\`studentReferenceId\`, \`classReferenceId\`, \`year\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`events\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`eventDate\` datetime NOT NULL,
                \`eventHebrewDate\` varchar(255) NULL,
                \`eventHebrewMonth\` varchar(255) NULL,
                \`completed\` tinyint NOT NULL DEFAULT 0,
                \`grade\` decimal(5, 2) NULL,
                \`eventTypeId\` int NULL,
                \`eventTypeReferenceId\` int NULL,
                \`teacherTz\` int NULL,
                \`teacherReferenceId\` int NULL,
                \`studentTz\` int NULL,
                \`studentReferenceId\` int NULL,
                \`levelTypeId\` int NULL,
                \`levelTypeReferenceId\` int NULL,
                \`completedPathKey\` int NULL,
                \`completedPathReferenceId\` int NULL,
                \`completionReportDate\` datetime NULL,
                \`year\` int NULL,
                \`studentClassReferenceId\` int NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`events_student_class_reference_id_idx\` (\`studentClassReferenceId\`),
                INDEX \`events_event_hebrew_month_idx\` (\`eventHebrewMonth\`),
                INDEX \`events_event_date_idx\` (\`eventDate\`),
                INDEX \`events_level_type_id_idx\` (\`levelTypeReferenceId\`),
                INDEX \`events_student_id_idx\` (\`studentReferenceId\`),
                INDEX \`events_teacher_id_idx\` (\`teacherReferenceId\`),
                INDEX \`events_event_type_id_idx\` (\`eventTypeReferenceId\`),
                INDEX \`events_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`prices\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`key\` int NOT NULL,
                \`price\` decimal(8, 2) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`prices_key_idx\` (\`key\`),
                INDEX \`prices_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`salary_reports\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`ids\` text NULL,
                \`date\` datetime NOT NULL,
                \`name\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`salary_reports_date_idx\` (\`date\`),
                INDEX \`salary_reports_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`teacher_types\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`key\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`teacher_types_key_idx\` (\`key\`),
                INDEX \`teacher_types_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`working_dates\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`teacher_type_id\` int NULL,
                \`working_date\` date NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                INDEX \`working_dates_working_date_idx\` (\`working_date\`),
                INDEX \`working_dates_teacher_type_id_idx\` (\`teacher_type_id\`),
                INDEX \`working_dates_user_id_idx\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`yemot_call\`
            ADD CONSTRAINT \`FK_2f2c39a9491ac1a6e2d7827bb53\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD CONSTRAINT \`FK_4668d4752e6766682d1be0b346f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD CONSTRAINT \`FK_bb43097cf3a5ba9d6cead7354e4\` FOREIGN KEY (\`own_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`question_types\`
            ADD CONSTRAINT \`FK_cae7915ad3b1e6835c83438139b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD CONSTRAINT \`FK_5800cd25a5888174b2c40e67d4b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD CONSTRAINT \`FK_833c9f88f4b33c2557c5f0aa4c3\` FOREIGN KEY (\`question_type_id\`) REFERENCES \`question_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_types\`
            ADD CONSTRAINT \`FK_df6c95beffa9b461ce26e82ec89\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_9d957ce6784d7557d12781d3f0e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_bf3281887aea53866eaa7f6b6c0\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_add3a0d0e4f9c83dc3eb39e6268\` FOREIGN KEY (\`activity_type\`) REFERENCES \`att_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_f4cf663ebeca05b7a12f6a2cc97\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_695b91293aa902ae6e1715a1ce6\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_677120094cf6d3f12df0b9dc5d3\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_c632b11e00aadd79d1ffad736f6\` FOREIGN KEY (\`report_id\`) REFERENCES \`att_reports\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_notes\`
            ADD CONSTRAINT \`FK_11b8178349b9da9e78b5ebca677\` FOREIGN KEY (\`eventReferenceId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_notes\`
            ADD CONSTRAINT \`FK_39c465c063fe658707ce021b8ed\` FOREIGN KEY (\`authorReferenceId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_gifts\`
            ADD CONSTRAINT \`FK_b6b55a287c3c3e41880bf2ef47d\` FOREIGN KEY (\`eventReferenceId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_gifts\`
            ADD CONSTRAINT \`FK_78b1a4b4bc4ad238b51cf51118b\` FOREIGN KEY (\`giftReferenceId\`) REFERENCES \`gifts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_classes\`
            ADD CONSTRAINT \`FK_64129dca85e1aa49a277dce81d5\` FOREIGN KEY (\`studentReferenceId\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_classes\`
            ADD CONSTRAINT \`FK_1d2537916600593353f8a79363e\` FOREIGN KEY (\`classReferenceId\`) REFERENCES \`classes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\`
            ADD CONSTRAINT \`FK_b2c5199d6122113e616a9202f5d\` FOREIGN KEY (\`eventTypeReferenceId\`) REFERENCES \`event_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\`
            ADD CONSTRAINT \`FK_5c23a238694da06fcb4945ebe7f\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\`
            ADD CONSTRAINT \`FK_839f8cfeea5757c419a69a7ea34\` FOREIGN KEY (\`studentReferenceId\`) REFERENCES \`students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\`
            ADD CONSTRAINT \`FK_1375571a7df823cd26725623906\` FOREIGN KEY (\`studentClassReferenceId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\`
            ADD CONSTRAINT \`FK_c3a817dd6cfa3c2edc981cad0f9\` FOREIGN KEY (\`levelTypeReferenceId\`) REFERENCES \`level_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\`
            ADD CONSTRAINT \`FK_8fb4246e6783cba11993ad545be\` FOREIGN KEY (\`completedPathReferenceId\`) REFERENCES \`level_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\`
            ADD CONSTRAINT \`FK_1a44645df1d3ed2e13735776fab\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`salary_reports\`
            ADD CONSTRAINT \`FK_4096834645c3164634ac8dfe5e9\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`teacher_types\`
            ADD CONSTRAINT \`FK_72437f9873615d632a897116f20\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`working_dates\`
            ADD CONSTRAINT \`FK_c1720930042a3681c716b01d14e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            CREATE VIEW \`text_by_user\` AS
            SELECT \`t_base\`.\`name\` AS \`name\`,
                \`t_base\`.\`description\` AS \`description\`,
                \`users\`.\`id\` AS \`userId\`,
                \`t_user\`.\`id\` AS \`overrideTextId\`,
                CONCAT(\`users\`.\`id\`, "_", \`t_base\`.\`id\`) AS \`id\`,
                COALESCE(\`t_user\`.\`value\`, \`t_base\`.\`value\`) AS \`value\`
            FROM \`texts\` \`t_base\`
                LEFT JOIN \`users\` \`users\` ON \`users\`.\`effective_id\` is null
                LEFT JOIN \`texts\` \`t_user\` ON \`t_user\`.\`name\` = \`t_base\`.\`name\`
                AND \`t_user\`.\`user_id\` = \`users\`.\`id\`
            WHERE \`t_base\`.\`user_id\` = 0
            ORDER BY \`users\`.\`id\` ASC,
                \`t_base\`.\`id\` ASC
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
        `, ["teacher_report_nra","VIEW","text_by_user","SELECT `t_base`.`name` AS `name`, `t_base`.`description` AS `description`, `users`.`id` AS `userId`, `t_user`.`id` AS `overrideTextId`, CONCAT(`users`.`id`, \"_\", `t_base`.`id`) AS `id`, COALESCE(`t_user`.`value`, `t_base`.`value`) AS `value` FROM `texts` `t_base` LEFT JOIN `users` `users` ON `users`.`effective_id` is null  LEFT JOIN `texts` `t_user` ON `t_user`.`name` = `t_base`.`name` AND `t_user`.`user_id` = `users`.`id` WHERE `t_base`.`user_id` = 0 ORDER BY `users`.`id` ASC, `t_base`.`id` ASC"]);
        await queryRunner.query(`
            CREATE VIEW \`student_by_year\` AS
            SELECT \`student_class\`.\`year\` AS \`year\`,
                \`student_class\`.\`studentReferenceId\` AS \`studentReferenceId\`,
                \`student\`.\`tz\` AS \`studentTz\`,
                \`student\`.\`name\` AS \`studentName\`,
                CONCAT(
                    \`student_class\`.\`studentReferenceId\`,
                    '_',
                    \`student_class\`.\`year\`
                ) AS \`id\`,
                GROUP_CONCAT(DISTINCT \`class\`.\`name\` SEPARATOR ', ') AS \`class_names\`,
                GROUP_CONCAT(DISTINCT \`class\`.\`id\` SEPARATOR ', ') AS \`class_reference_ids\`
            FROM \`student_classes\` \`student_class\`
                LEFT JOIN \`classes\` \`class\` ON \`class\`.\`id\` = \`student_class\`.\`classReferenceId\`
                LEFT JOIN \`students\` \`student\` ON \`student\`.\`id\` = \`student_class\`.\`studentReferenceId\`
            GROUP BY \`student_class\`.\`studentReferenceId\`,
                \`student_class\`.\`year\`
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
        `, ["teacher_report_nra","VIEW","student_by_year","SELECT `student_class`.`year` AS `year`, `student_class`.`studentReferenceId` AS `studentReferenceId`, `student`.`tz` AS `studentTz`, `student`.`name` AS `studentName`, CONCAT(`student_class`.`studentReferenceId`, '_', `student_class`.`year`) AS `id`, GROUP_CONCAT(DISTINCT `class`.`name` SEPARATOR ', ') AS `class_names`, GROUP_CONCAT(DISTINCT `class`.`id` SEPARATOR ', ') AS `class_reference_ids` FROM `student_classes` `student_class` LEFT JOIN `classes` `class` ON `class`.`id` = `student_class`.`classReferenceId`  LEFT JOIN `students` `student` ON `student`.`id` = `student_class`.`studentReferenceId` GROUP BY `student_class`.`studentReferenceId`, `student_class`.`year`"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","student_by_year","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`student_by_year\`
        `);
        await queryRunner.query(`
            DELETE FROM \`teacher_report_nra\`.\`typeorm_metadata\`
            WHERE \`type\` = ?
                AND \`name\` = ?
                AND \`schema\` = ?
        `, ["VIEW","text_by_user","teacher_report_nra"]);
        await queryRunner.query(`
            DROP VIEW \`text_by_user\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`working_dates\` DROP FOREIGN KEY \`FK_c1720930042a3681c716b01d14e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`teacher_types\` DROP FOREIGN KEY \`FK_72437f9873615d632a897116f20\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`salary_reports\` DROP FOREIGN KEY \`FK_4096834645c3164634ac8dfe5e9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\` DROP FOREIGN KEY \`FK_1a44645df1d3ed2e13735776fab\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_8fb4246e6783cba11993ad545be\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_c3a817dd6cfa3c2edc981cad0f9\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_1375571a7df823cd26725623906\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_839f8cfeea5757c419a69a7ea34\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_5c23a238694da06fcb4945ebe7f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_b2c5199d6122113e616a9202f5d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_classes\` DROP FOREIGN KEY \`FK_1d2537916600593353f8a79363e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`student_classes\` DROP FOREIGN KEY \`FK_64129dca85e1aa49a277dce81d5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_gifts\` DROP FOREIGN KEY \`FK_78b1a4b4bc4ad238b51cf51118b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_gifts\` DROP FOREIGN KEY \`FK_b6b55a287c3c3e41880bf2ef47d\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_notes\` DROP FOREIGN KEY \`FK_39c465c063fe658707ce021b8ed\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`event_notes\` DROP FOREIGN KEY \`FK_11b8178349b9da9e78b5ebca677\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_c632b11e00aadd79d1ffad736f6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_677120094cf6d3f12df0b9dc5d3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_695b91293aa902ae6e1715a1ce6\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_f4cf663ebeca05b7a12f6a2cc97\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_add3a0d0e4f9c83dc3eb39e6268\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_bf3281887aea53866eaa7f6b6c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_9d957ce6784d7557d12781d3f0e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`att_types\` DROP FOREIGN KEY \`FK_df6c95beffa9b461ce26e82ec89\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_833c9f88f4b33c2557c5f0aa4c3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_5800cd25a5888174b2c40e67d4b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question_types\` DROP FOREIGN KEY \`FK_cae7915ad3b1e6835c83438139b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP FOREIGN KEY \`FK_bb43097cf3a5ba9d6cead7354e4\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP FOREIGN KEY \`FK_4668d4752e6766682d1be0b346f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`yemot_call\` DROP FOREIGN KEY \`FK_2f2c39a9491ac1a6e2d7827bb53\`
        `);
        await queryRunner.query(`
            DROP INDEX \`working_dates_user_id_idx\` ON \`working_dates\`
        `);
        await queryRunner.query(`
            DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\`
        `);
        await queryRunner.query(`
            DROP INDEX \`working_dates_working_date_idx\` ON \`working_dates\`
        `);
        await queryRunner.query(`
            DROP TABLE \`working_dates\`
        `);
        await queryRunner.query(`
            DROP INDEX \`teacher_types_user_id_idx\` ON \`teacher_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`teacher_types_key_idx\` ON \`teacher_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`teacher_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`salary_reports_user_id_idx\` ON \`salary_reports\`
        `);
        await queryRunner.query(`
            DROP INDEX \`salary_reports_date_idx\` ON \`salary_reports\`
        `);
        await queryRunner.query(`
            DROP TABLE \`salary_reports\`
        `);
        await queryRunner.query(`
            DROP INDEX \`prices_user_id_idx\` ON \`prices\`
        `);
        await queryRunner.query(`
            DROP INDEX \`prices_key_idx\` ON \`prices\`
        `);
        await queryRunner.query(`
            DROP TABLE \`prices\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_user_id_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_event_type_id_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_teacher_id_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_student_id_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_level_type_id_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_event_date_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_event_hebrew_month_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`events_student_class_reference_id_idx\` ON \`events\`
        `);
        await queryRunner.query(`
            DROP TABLE \`events\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_1a74fabb33731a4f123b7671f9\` ON \`student_classes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_classes_user_id_idx\` ON \`student_classes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_classes_student_idx\` ON \`student_classes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`student_classes_class_idx\` ON \`student_classes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`student_classes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`classes_name_idx\` ON \`classes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`classes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`level_types_user_id_idx\` ON \`level_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`level_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_49ecdf64dd02d36d7423b04708\` ON \`event_gifts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_gifts_event_id_idx\` ON \`event_gifts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_gifts_gift_id_idx\` ON \`event_gifts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_gifts_user_id_idx\` ON \`event_gifts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_gifts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`gifts_user_id_idx\` ON \`gifts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`gifts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_notes_event_id_idx\` ON \`event_notes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_notes_author_id_idx\` ON \`event_notes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_notes_user_id_idx\` ON \`event_notes\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_notes\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_792054225739143030d210a629\` ON \`students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`students_user_id_idx\` ON \`students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`students_name_idx\` ON \`students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`students_tz_idx\` ON \`students\`
        `);
        await queryRunner.query(`
            DROP TABLE \`students\`
        `);
        await queryRunner.query(`
            DROP INDEX \`event_types_user_id_idx\` ON \`event_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`event_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_user_id_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_teacher_id_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_question_id_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_report_id_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`answers_answer_date_idx\` ON \`answers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`answers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`att_reports_user_id_idx\` ON \`att_reports\`
        `);
        await queryRunner.query(`
            DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\`
        `);
        await queryRunner.query(`
            DROP INDEX \`att_reports_report_date_idx\` ON \`att_reports\`
        `);
        await queryRunner.query(`
            DROP INDEX \`att_reports_year_idx\` ON \`att_reports\`
        `);
        await queryRunner.query(`
            DROP TABLE \`att_reports\`
        `);
        await queryRunner.query(`
            DROP INDEX \`att_types_user_id_idx\` ON \`att_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`att_types_name_idx\` ON \`att_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`att_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`questions_user_id_idx\` ON \`questions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`questions_question_type_id_idx\` ON \`questions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`questions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`question_types_user_id_idx\` ON \`question_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`question_types_key_idx\` ON \`question_types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`question_types\`
        `);
        await queryRunner.query(`
            DROP INDEX \`teachers_user_id_idx\` ON \`teachers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`teachers_name_idx\` ON \`teachers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`teachers_own_user_id_idx\` ON \`teachers\`
        `);
        await queryRunner.query(`
            DROP TABLE \`teachers\`
        `);
        await queryRunner.query(`
            DROP INDEX \`yemot_call_api_call_id_idx\` ON \`yemot_call\`
        `);
        await queryRunner.query(`
            DROP TABLE \`yemot_call\`
        `);
        await queryRunner.query(`
            DROP INDEX \`user_phone_number_idx\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
        await queryRunner.query(`
            DROP INDEX \`texts_users_idx\` ON \`texts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`texts_name_idx\` ON \`texts\`
        `);
        await queryRunner.query(`
            DROP INDEX \`texts_user_id_name_idx\` ON \`texts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`texts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`recieved_mail\`
        `);
        await queryRunner.query(`
            DROP TABLE \`payment_track\`
        `);
        await queryRunner.query(`
            DROP TABLE \`page\`
        `);
        await queryRunner.query(`
            DROP TABLE \`audit_log\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_10d2242b0e45f6add0b4269cbf\` ON \`mail_address\`
        `);
        await queryRunner.query(`
            DROP TABLE \`mail_address\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_35596848f8bb8f7b5ec5fcf9e0\` ON \`image\`
        `);
        await queryRunner.query(`
            DROP TABLE \`image\`
        `);
        await queryRunner.query(`
            DROP TABLE \`import_file\`
        `);
    }

}
