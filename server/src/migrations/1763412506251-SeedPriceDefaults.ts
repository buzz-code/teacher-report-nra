import { MigrationInterface, QueryRunner, In } from 'typeorm';
import { Price } from '../db/entities/Price.entity';

/**
 * Seeds default prices for the pricing system.
 *
 * Teacher types are encoded in code prefixes:
 * - Universal prices: no prefix (e.g., lesson.base)
 * - SEMINAR_KITA (type 1): seminar.
 * - MANHA (type 3): manha.
 * - PDS (type 5): pds.
 * - KINDERGARTEN (type 6): kindergarten.
 * - SPECIAL_EDUCATION (type 7): special.
 *
 * All prices are seeded with user_id = 0 (system defaults).
 * Users can override these prices individually via the PriceByUser view.
 */
export class SeedPriceDefaults1763412506251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const priceRepository = queryRunner.manager.getRepository(Price);

    const pricesToSeed = [
      // Universal Prices
      { userId: 0, code: 'lesson.base', description: 'תעריף בסיס לשיעור', price: 50.0 },

      // SEMINAR_KITA (Type 1)
      { userId: 0, code: 'seminar.student_multiplier', description: 'סמינר כיתה - תעריף לכל תלמידה', price: 5.0 },
      { userId: 0, code: 'seminar.lesson_multiplier', description: 'סמינר כיתה - תעריף לכל שיעור', price: 10.0 },
      {
        userId: 0,
        code: 'seminar.watch_individual_multiplier',
        description: 'סמינר כיתה - תעריף צפייה/אישי',
        price: 8.0,
      },
      {
        userId: 0,
        code: 'seminar.interfere_teach_multiplier',
        description: 'סמינר כיתה - תעריף התערבות/הוראה',
        price: 12.0,
      },
      { userId: 0, code: 'seminar.kamal_bonus', description: 'סמינר כיתה - בונוס כמל', price: 15.0 },
      {
        userId: 0,
        code: 'seminar.discussing_lesson_multiplier',
        description: 'סמינר כיתה - תעריף שיעור דיון',
        price: 7.0,
      },

      // MANHA (Type 3)
      { userId: 0, code: 'manha.methodic_multiplier', description: 'מורה מנחה - תעריף עבודה מתודית', price: 8.0 },
      { userId: 0, code: 'manha.taarif_hulia_bonus', description: 'מורה מנחה - בונוס תעריף חוליה', price: 10.0 },
      { userId: 0, code: 'manha.taarif_hulia2_bonus', description: 'מורה מנחה - בונוס תעריף חוליה 2', price: 10.0 },
      { userId: 0, code: 'manha.taarif_hulia3_bonus', description: 'מורה מנחה - בונוס תעריף חוליה 3', price: 10.0 },
      { userId: 0, code: 'manha.watched_lesson_multiplier', description: 'מורה מנחה - תעריף שיעור נצפה', price: 6.0 },
      { userId: 0, code: 'manha.student_multiplier', description: 'מורה מנחה - תעריף לכל תלמידה', price: 5.0 },
      { userId: 0, code: 'manha.yalkut_lesson_multiplier', description: 'מורה מנחה - תעריף שיעור ילקוט', price: 9.0 },
      {
        userId: 0,
        code: 'manha.discussing_lesson_multiplier',
        description: 'מורה מנחה - תעריף שיעור דיון',
        price: 7.0,
      },
      { userId: 0, code: 'manha.help_taught_multiplier', description: 'מורה מנחה - תעריף עזרה בהוראה', price: 11.0 },

      // PDS (Type 5)
      { userId: 0, code: 'pds.watch_individual_multiplier', description: 'פד"ס - תעריף צפייה/אישי', price: 8.0 },
      { userId: 0, code: 'pds.interfere_teach_multiplier', description: 'פד"ס - תעריף התערבות/הוראה', price: 12.0 },
      { userId: 0, code: 'pds.discussing_lesson_multiplier', description: 'פד"ס - תעריף שיעור דיון', price: 7.0 },

      // KINDERGARTEN (Type 6)
      {
        userId: 0,
        code: 'kindergarten.collective_watch_bonus',
        description: 'גננות - בונוס צפייה קבוצתית',
        price: 20.0,
      },
      { userId: 0, code: 'kindergarten.student_multiplier', description: 'גננות - תעריף לכל תלמיד', price: 3.0 },

      // SPECIAL_EDUCATION (Type 7)
      { userId: 0, code: 'special.lesson_multiplier', description: 'חינוך מיוחד - תעריף לכל שיעור', price: 10.0 },
      { userId: 0, code: 'special.student_multiplier', description: 'חינוך מיוחד - תעריף לכל תלמיד', price: 6.0 },
      {
        userId: 0,
        code: 'special.phone_discussion_bonus',
        description: 'חינוך מיוחד - בונוס דיון טלפוני',
        price: 15.0,
      },
    ];

    for (const priceData of pricesToSeed) {
      // Check if price already exists
      const existingPrice = await priceRepository.findOne({
        where: { userId: priceData.userId, code: priceData.code },
      });

      if (existingPrice) {
        // Update existing price
        existingPrice.description = priceData.description;
        existingPrice.price = priceData.price;
        await priceRepository.save(existingPrice);
      } else {
        // Create new price
        const price = priceRepository.create(priceData);
        await priceRepository.save(price);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const priceRepository = queryRunner.manager.getRepository(Price);

    const codesToRemove = [
      // Universal
      'lesson.base',
      // SEMINAR_KITA
      'seminar.student_multiplier',
      'seminar.lesson_multiplier',
      'seminar.watch_individual_multiplier',
      'seminar.interfere_teach_multiplier',
      'seminar.kamal_bonus',
      'seminar.discussing_lesson_multiplier',
      // MANHA
      'manha.methodic_multiplier',
      'manha.taarif_hulia_bonus',
      'manha.taarif_hulia2_bonus',
      'manha.taarif_hulia3_bonus',
      'manha.watched_lesson_multiplier',
      'manha.student_multiplier',
      'manha.yalkut_lesson_multiplier',
      'manha.discussing_lesson_multiplier',
      'manha.help_taught_multiplier',
      // PDS
      'pds.watch_individual_multiplier',
      'pds.interfere_teach_multiplier',
      'pds.discussing_lesson_multiplier',
      // KINDERGARTEN
      'kindergarten.collective_watch_bonus',
      'kindergarten.student_multiplier',
      // SPECIAL_EDUCATION
      'special.lesson_multiplier',
      'special.student_multiplier',
      'special.phone_discussion_bonus',
    ];

    // Delete all seeded prices
    await priceRepository.delete({
      userId: 0,
      code: In(codesToRemove),
    });
  }
}
