import { Text } from '@shared/entities/Text.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddQuestionValidationTexts1761158563113 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    await textRepo.save({
      name: 'VALIDATION.OUT_OF_RANGE',
      value: 'המספר צריך להיות בין {min} ל-{max}',
      description: 'המספר צריך להיות בין {min} ל-{max}',
      userId: 0,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);
    await textRepo.delete({ name: 'VALIDATION.OUT_OF_RANGE' });
  }
}
