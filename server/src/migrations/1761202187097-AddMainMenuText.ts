import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMainMenuText1761202187097 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO \`texts\` (\`name\`, \`value\`, \`description\`, \`userId\`)
      VALUES ('REPORT.MAIN_MENU', 'לתיקוף נוכחות הקישי 1, לשמיעת דיווחים קודמים הקישי 3', 'לתיקוף נוכחות הקישי 1, לשמיעת דיווחים קודמים הקישי 3', 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM \`texts\` WHERE \`name\` = 'REPORT.MAIN_MENU'
    `);
  }
}
