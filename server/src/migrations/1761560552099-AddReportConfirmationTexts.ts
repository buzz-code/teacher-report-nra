import { MigrationInterface, QueryRunner } from 'typeorm';
import { Text } from '@shared/entities/Text.entity';

export class AddReportConfirmationTexts1761560552099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    // Add confirmation text for Seminar Kita reports
    await textRepo.save({
      name: 'REPORT.VALIDATION_CONFIRM_SEMINAR_KITA',
      value:
        'נא לאשר את הדיווח: תלמידות {students}, שיעורים {lessons}, צפיה/פרטני {watchIndiv}, מסירה/מעורבות {teachInterf}, קמל {kamal}, דיונים {discuss}, חיסורים {absence}. לאישור הקישי 1, לשינוי הקישי 2',
      description: 'הודעת אישור דיווח למורה סמינר כתה',
      userId: 0,
    });

    // Add confirmation text for Kindergarten reports
    await textRepo.save({
      name: 'REPORT.VALIDATION_CONFIRM_KINDERGARTEN',
      value:
        'נא לאשר את הדיווח: צפיה קולקטיבית {collective}, תלמידות {students}, תפקוד טוב {studentsGood}. לאישור הקישי 1, לשינוי הקישי 2',
      description: 'הודעת אישור דיווח למורה גן',
      userId: 0,
    });

    // Add confirmation text for Special Education reports
    await textRepo.save({
      name: 'REPORT.VALIDATION_CONFIRM_SPECIAL_EDUCATION',
      value:
        'נא לאשר את הדיווח: שיעורים {lessons}, צופות {studentsWatched}, מוסרות {studentsTeached}, דיון טלפוני {phoneDiscuss}, התמחות {speciality}. לאישור הקישי 1, לשינוי הקישי 2',
      description: 'הודעת אישור דיווח למורה חינוך מיוחד',
      userId: 0,
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const textRepo = queryRunner.manager.getRepository(Text);

    await textRepo.delete({ name: 'REPORT.VALIDATION_CONFIRM_SEMINAR_KITA' });
    await textRepo.delete({ name: 'REPORT.VALIDATION_CONFIRM_KINDERGARTEN' });
    await textRepo.delete({ name: 'REPORT.VALIDATION_CONFIRM_SPECIAL_EDUCATION' });
  }
}
