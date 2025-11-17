import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreatePriceEntity1763411635406 implements MigrationInterface {
    name = 'RecreatePriceEntity1763411635406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`prices\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\` DROP FOREIGN KEY \`FK_1a44645df1d3ed2e13735776fab\`
        `);
        await queryRunner.query(`
            DROP INDEX \`prices_key_idx\` ON \`prices\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\` DROP COLUMN \`key\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\`
            ADD \`code\` varchar(100) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\`
            ADD \`description\` varchar(500) NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`prices_user_id_code_idx\` ON \`prices\` (\`user_id\`, \`code\`)
        `);
        await queryRunner.query(`
            CREATE INDEX \`prices_code_idx\` ON \`prices\` (\`code\`)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`prices_code_idx\` ON \`prices\`
        `);
        await queryRunner.query(`
            DROP INDEX \`prices_user_id_code_idx\` ON \`prices\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\` DROP COLUMN \`description\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\` DROP COLUMN \`code\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\`
            ADD \`key\` int NOT NULL
        `);
        await queryRunner.query(`
            CREATE INDEX \`prices_key_idx\` ON \`prices\` (\`key\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`prices\`
            ADD CONSTRAINT \`FK_1a44645df1d3ed2e13735776fab\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
