import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveStudent1767126973737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys from student_classes
        const table = await queryRunner.getTable("student_classes");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("studentReferenceId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("student_classes", foreignKey);
            }
        }

        // Drop foreign keys from events
        const eventsTable = await queryRunner.getTable("events");
        if (eventsTable) {
            const foreignKey = eventsTable.foreignKeys.find(fk => fk.columnNames.indexOf("studentReferenceId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("events", foreignKey);
            }
        }

        // Drop student_classes table if it exists
        await queryRunner.query(`DROP TABLE IF EXISTS \`student_classes\``);

        // Drop students table
        await queryRunner.query(`DROP TABLE \`students\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Table restoration is not implemented as the entity file has been deleted.
    }

}
