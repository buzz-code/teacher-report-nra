import { MigrationInterface, QueryRunner } from 'typeorm';
import { Text } from '@shared/entities/Text.entity';

export class AddQuestionSkipTexts1761165059342 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    await textRepo.save({
      name: 'QUESTION.SKIP_INSTRUCTION',
      value: 'לדלג על השאלה ולענות בפעם הבאה לחצי כוכבית',
      description: 'הודעה למורה שניתן לדלג על שאלה אופציונלית',
      userId: 0,
    });

    await textRepo.save({
      name: 'QUESTION.CANNOT_SKIP_MANDATORY',
      value: 'לא ניתן לדלג על שאלה זו, אנא ענה',
      description: 'הודעת שגיאה כאשר מורה מנסה לדלג על שאלה חובה',
      userId: 0,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    await textRepo.delete({ name: 'QUESTION.SKIP_INSTRUCTION' });
    await textRepo.delete({ name: 'QUESTION.CANNOT_SKIP_MANDATORY' });
  }
}
