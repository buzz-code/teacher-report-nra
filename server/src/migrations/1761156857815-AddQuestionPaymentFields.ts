import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionPaymentFields1761156857815 implements MigrationInterface {
    name = 'AddQuestionPaymentFields1761156857815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`allowed_digits\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`is_standalone\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`upper_limit\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`lower_limit\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`tariff\` decimal(10, 2) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`is_mandatory\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`is_mandatory\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`tariff\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`lower_limit\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\` DROP COLUMN \`upper_limit\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`is_standalone\` tinyint NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`questions\`
            ADD \`allowed_digits\` varchar(255) NULL
        `);
    }

}
