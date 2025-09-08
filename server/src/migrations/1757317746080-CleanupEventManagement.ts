import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanupEventManagement1757317746080 implements MigrationInterface {
    name = 'CleanupEventManagement1757317746080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`address\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`motherName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`motherContact\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`fatherName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`fatherContact\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`motherPreviousName\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`phone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\` DROP COLUMN \`email\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`email\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`phone\` varchar(50) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`motherPreviousName\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`fatherContact\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`fatherName\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`motherContact\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`motherName\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`students\`
            ADD \`address\` text NULL
        `);
    }

}
