import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveStudent1767126973737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`students\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Table restoration is not implemented as the entity file has been deleted.
    }

}
