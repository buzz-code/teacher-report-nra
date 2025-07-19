import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingAttReportFields1752958000000 implements MigrationInterface {
    name = 'AddMissingAttReportFields1752958000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`how_many_lessons\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`how_many_watch_or_individual\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`how_many_teached_or_interfering\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`how_many_students_teached\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`how_many_students_watched\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`was_phone_discussing\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`att_reports\` ADD \`what_is_your_speciality\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`what_is_your_speciality\``);
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`was_phone_discussing\``);
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`how_many_students_watched\``);
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`how_many_students_teached\``);
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`how_many_teached_or_interfering\``);
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`how_many_watch_or_individual\``);
        await queryRunner.query(`ALTER TABLE \`att_reports\` DROP COLUMN \`how_many_lessons\``);
    }
}