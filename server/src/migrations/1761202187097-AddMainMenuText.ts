import { MigrationInterface, QueryRunner } from 'typeorm';
import { Text } from '@shared/entities/Text.entity';

export class AddMainMenuText1761202187097 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);
    await textRepo.insert({
      name: 'REPORT.MAIN_MENU',
      value: 'לתיקוף נוכחות הקישי 1, לשמיעת דיווחים קודמים הקישי 3',
      description: 'לתיקוף נוכחות הקישי 1, לשמיעת דיווחים קודמים הקישי 3',
      userId: 0,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);
    await textRepo.delete({ name: 'REPORT.MAIN_MENU' });
  }
}
