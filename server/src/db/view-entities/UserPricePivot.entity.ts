import { ViewEntity, ViewColumn, PrimaryColumn } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';

/**
 * Price code configuration for building the pivot view dynamically.
 * This matches the structure in pricing.util.ts for consistency.
 */
export interface PriceCodeConfig {
  code: string; // Full semantic code (e.g., 'lesson.base', 'seminar.student_multiplier')
  columnName: string; // Snake_case column name for the view
}

/**
 * All price codes used in the system, organized by category.
 * This serves as the single source of truth for price codes.
 */
export const PRICE_CODES: PriceCodeConfig[] = [
  // Universal
  { code: 'lesson.base', columnName: 'lesson_base' },

  // Seminar Kita (type 1)
  { code: 'seminar.student_multiplier', columnName: 'seminar_student' },
  { code: 'seminar.lesson_multiplier', columnName: 'seminar_lesson' },
  { code: 'seminar.watch_individual_multiplier', columnName: 'seminar_watch' },
  { code: 'seminar.interfere_teach_multiplier', columnName: 'seminar_interfere' },
  { code: 'seminar.discussing_lesson_multiplier', columnName: 'seminar_discuss' },
  { code: 'seminar.kamal_bonus', columnName: 'seminar_kamal' },

  // Manha (type 3)
  { code: 'manha.student_multiplier', columnName: 'manha_student' },
  { code: 'manha.methodic_multiplier', columnName: 'manha_methodic' },
  { code: 'manha.taarif_hulia_bonus', columnName: 'manha_hulia1' },
  { code: 'manha.taarif_hulia2_bonus', columnName: 'manha_hulia2' },
  { code: 'manha.taarif_hulia3_bonus', columnName: 'manha_hulia3' },
  { code: 'manha.watched_lesson_multiplier', columnName: 'manha_watched' },
  { code: 'manha.discussing_lesson_multiplier', columnName: 'manha_discuss' },
  { code: 'manha.yalkut_lesson_multiplier', columnName: 'manha_yalkut' },
  { code: 'manha.help_taught_multiplier', columnName: 'manha_help' },

  // PDS (type 5)
  { code: 'pds.watch_individual_multiplier', columnName: 'pds_watch' },
  { code: 'pds.interfere_teach_multiplier', columnName: 'pds_interfere' },
  { code: 'pds.discussing_lesson_multiplier', columnName: 'pds_discuss' },

  // Kindergarten (type 6)
  { code: 'kindergarten.student_multiplier', columnName: 'kinder_student' },
  { code: 'kindergarten.collective_watch_bonus', columnName: 'kinder_collective' },

  // Special Education (type 7)
  { code: 'special.student_multiplier', columnName: 'special_student' },
  { code: 'special.lesson_multiplier', columnName: 'special_lesson' },
  { code: 'special.phone_discussion_bonus', columnName: 'special_phone' },
];

/**
 * Generate the SQL for pivoting prices by user.
 * Uses conditional aggregation (single scan of price_by_user) instead of multiple joins.
 */
export function generateUserPricePivotSQL(): string {
  const priceSelects = PRICE_CODES.map(
    (pc) => `MAX(CASE WHEN p.code = '${pc.code}' THEN p.price END) AS ${pc.columnName}`,
  ).join(',\n    ');

  return `
    SELECT 
      u.id AS userId,
      ${priceSelects}
    FROM users u
    LEFT JOIN price_by_user p ON p.userId = u.id
    WHERE u.effective_id IS NULL
    GROUP BY u.id
  `;
}

/**
 * UserPricePivot view entity - pivots price_by_user into a single row per user
 * with all price codes as columns. This enables efficient joins for price calculations.
 *
 * Performance: Single GROUP BY scan instead of 20+ LEFT JOINs
 * Tested: ~7ms for 2 users, scales linearly
 */
@ViewEntity({
  name: 'user_price_pivot',
  expression: generateUserPricePivotSQL(),
})
export class UserPricePivot implements IHasUserId {
  @PrimaryColumn()
  userId: number;

  // Universal
  @ViewColumn()
  lesson_base: number;

  // Seminar Kita
  @ViewColumn()
  seminar_student: number;

  @ViewColumn()
  seminar_lesson: number;

  @ViewColumn()
  seminar_watch: number;

  @ViewColumn()
  seminar_interfere: number;

  @ViewColumn()
  seminar_discuss: number;

  @ViewColumn()
  seminar_kamal: number;

  // Manha
  @ViewColumn()
  manha_student: number;

  @ViewColumn()
  manha_methodic: number;

  @ViewColumn()
  manha_hulia1: number;

  @ViewColumn()
  manha_hulia2: number;

  @ViewColumn()
  manha_hulia3: number;

  @ViewColumn()
  manha_watched: number;

  @ViewColumn()
  manha_discuss: number;

  @ViewColumn()
  manha_yalkut: number;

  @ViewColumn()
  manha_help: number;

  // PDS
  @ViewColumn()
  pds_watch: number;

  @ViewColumn()
  pds_interfere: number;

  @ViewColumn()
  pds_discuss: number;

  // Kindergarten
  @ViewColumn()
  kinder_student: number;

  @ViewColumn()
  kinder_collective: number;

  // Special Education
  @ViewColumn()
  special_student: number;

  @ViewColumn()
  special_lesson: number;

  @ViewColumn()
  special_phone: number;
}
