import { MigrationInterface, QueryRunner } from 'typeorm';
import { Text } from '@shared/entities/Text.entity';

export class AddQuestionAnswerEchoText1761670738742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    await textRepo.save({
      name: 'QUESTION.ANSWER_ECHO',
      value: '{questionText}, קישת {answer}',
      description: 'הודעה שמחזירה למורה את תוכן השאלה והתשובה שהקיש',
      userId: 0,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    await textRepo.delete({ name: 'QUESTION.ANSWER_ECHO' });
  }
}
