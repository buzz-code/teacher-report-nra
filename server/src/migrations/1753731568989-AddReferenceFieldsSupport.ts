import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferenceFieldsSupport1753731568989 implements MigrationInterface {
  name = 'AddReferenceFieldsSupport1753731568989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_add3a0d0e4f9c83dc3eb39e6268\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_bf3281887aea53866eaa7f6b6c0\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_833c9f88f4b33c2557c5f0aa4c3\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_677120094cf6d3f12df0b9dc5d3\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_695b91293aa902ae6e1715a1ce6\`
        `);
    await queryRunner.query(`
            DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\`
        `);
    await queryRunner.query(`
            DROP INDEX \`questions_question_type_id_idx\` ON \`questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\`
        `);
    await queryRunner.query(`
            DROP INDEX \`answers_question_id_idx\` ON \`answers\`
        `);
    await queryRunner.query(`
            DROP INDEX \`answers_teacher_id_idx\` ON \`answers\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP COLUMN \`teacher_type_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP COLUMN \`teacher_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP COLUMN \`activity_type\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`teacher_type_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`question_type_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\` DROP COLUMN \`teacher_type_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`teacher_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`question_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD \`teacherTypeKey\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD \`teacherTypeReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_types\`
            ADD \`key\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD \`teacherTz\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD \`teacherReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD \`activityTypeKey\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD \`activityTypeReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`teacherTypeKey\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`teacherTypeReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`questionTypeKey\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`questionTypeReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\`
            ADD \`teacherTypeKey\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\`
            ADD \`teacherTypeReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`teacherTz\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`teacherReferenceId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`questionId\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`questionReferenceId\` int NULL
        `);
    await queryRunner.query(`
            CREATE INDEX \`teachers_teacher_type_id_idx\` ON \`teachers\` (\`teacherTypeReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`att_types_key_idx\` ON \`att_types\` (\`key\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`att_reports_activity_type_idx\` ON \`att_reports\` (\`activityTypeReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\` (\`teacherReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`questions_question_type_id_idx\` ON \`questions\` (\`questionTypeReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacherTypeReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\` (\`teacherTypeReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`answers_question_id_idx\` ON \`answers\` (\`questionReferenceId\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`answers_teacher_id_idx\` ON \`answers\` (\`teacherReferenceId\`)
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD CONSTRAINT \`FK_9ac987eed8f8430790a3e4e3597\` FOREIGN KEY (\`teacherTypeReferenceId\`) REFERENCES \`teacher_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_82f8943c2abf1da42d5ea056eca\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_636c3fd5f27623a613f7f2d3879\` FOREIGN KEY (\`activityTypeReferenceId\`) REFERENCES \`att_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD CONSTRAINT \`FK_ffb08405d93905accfe8bfe138f\` FOREIGN KEY (\`teacherTypeReferenceId\`) REFERENCES \`teacher_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD CONSTRAINT \`FK_592b378cb8653f74a52a4539bfa\` FOREIGN KEY (\`questionTypeReferenceId\`) REFERENCES \`question_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\`
            ADD CONSTRAINT \`FK_7c18d2c3a0822071567b4cc7c5b\` FOREIGN KEY (\`teacherTypeReferenceId\`) REFERENCES \`teacher_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_1c50040b63b2c28f06d8cfadf20\` FOREIGN KEY (\`teacherReferenceId\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD CONSTRAINT \`FK_17b43106c05ef48e665ea4e52b6\` FOREIGN KEY (\`questionReferenceId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_17b43106c05ef48e665ea4e52b6\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_1c50040b63b2c28f06d8cfadf20\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\` DROP FOREIGN KEY \`FK_7c18d2c3a0822071567b4cc7c5b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_592b378cb8653f74a52a4539bfa\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_ffb08405d93905accfe8bfe138f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_636c3fd5f27623a613f7f2d3879\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP FOREIGN KEY \`FK_82f8943c2abf1da42d5ea056eca\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP FOREIGN KEY \`FK_9ac987eed8f8430790a3e4e3597\`
        `);
    await queryRunner.query(`
            DROP INDEX \`answers_teacher_id_idx\` ON \`answers\`
        `);
    await queryRunner.query(`
            DROP INDEX \`answers_question_id_idx\` ON \`answers\`
        `);
    await queryRunner.query(`
            DROP INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\`
        `);
    await queryRunner.query(`
            DROP INDEX \`questions_teacher_type_id_idx\` ON \`questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`questions_question_type_id_idx\` ON \`questions\`
        `);
    await queryRunner.query(`
            DROP INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\`
        `);
    await queryRunner.query(`
            DROP INDEX \`att_reports_activity_type_idx\` ON \`att_reports\`
        `);
    await queryRunner.query(`
            DROP INDEX \`att_types_key_idx\` ON \`att_types\`
        `);
    await queryRunner.query(`
            DROP INDEX \`teachers_teacher_type_id_idx\` ON \`teachers\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`questionReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`questionId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`teacherReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\` DROP COLUMN \`teacherTz\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\` DROP COLUMN \`teacherTypeReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\` DROP COLUMN \`teacherTypeKey\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`questionTypeReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`questionTypeKey\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`teacherTypeKey\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP COLUMN \`activityTypeReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP COLUMN \`activityTypeKey\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP COLUMN \`teacherReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\` DROP COLUMN \`teacherTz\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_types\` DROP COLUMN \`key\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP COLUMN \`teacherTypeReferenceId\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\` DROP COLUMN \`teacherTypeKey\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`question_id\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`answers\`
            ADD \`teacher_id\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`working_dates\`
            ADD \`teacher_type_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`question_type_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`teacher_type_id\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD \`activity_type\` int NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD \`teacher_id\` int NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`teachers\`
            ADD \`teacher_type_id\` int NULL
        `);
    await queryRunner.query(`
            CREATE INDEX \`answers_teacher_id_idx\` ON \`answers\` (\`teacher_id\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`answers_question_id_idx\` ON \`answers\` (\`question_id\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`working_dates_teacher_type_id_idx\` ON \`working_dates\` (\`teacher_type_id\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`questions_teacher_type_id_idx\` ON \`questions\` (\`teacher_type_id\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`questions_question_type_id_idx\` ON \`questions\` (\`question_type_id\`)
        `);
    await queryRunner.query(`
            CREATE INDEX \`att_reports_teacher_id_idx\` ON \`att_reports\` (\`teacher_id\`)
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
            ALTER TABLE \`questions\`
            ADD CONSTRAINT \`FK_833c9f88f4b33c2557c5f0aa4c3\` FOREIGN KEY (\`question_type_id\`) REFERENCES \`question_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_bf3281887aea53866eaa7f6b6c0\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`teachers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`att_reports\`
            ADD CONSTRAINT \`FK_add3a0d0e4f9c83dc3eb39e6268\` FOREIGN KEY (\`activity_type\`) REFERENCES \`att_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
