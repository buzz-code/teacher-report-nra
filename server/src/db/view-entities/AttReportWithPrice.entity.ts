import { ViewEntity, ViewColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IHasUserId } from '@shared/base-entity/interface';
import { Teacher } from '../entities/Teacher.entity';
import { SalaryReport } from '../entities/SalaryReport.entity';
import { TeacherTypeId } from '../../utils/fieldsShow.util';

/**
 * Price field configuration for building the price calculation dynamically.
 * Maps report fields to price codes with optional factors.
 */
export interface PriceFieldConfig {
  reportColumn: string; // MySQL column name in att_reports
  priceColumn: string; // Column name in user_price_pivot
  factor?: number; // Multiplier factor (default 1, use -0.5 for absences, 0.5 for watched)
  isBonus?: boolean; // True for boolean fields (no quantity multiplication)
  teacherTypes: TeacherTypeId[]; // Which teacher types use this field
}

/**
 * All price field configurations - single source of truth for price calculations.
 * This mirrors the logic in pricing.util.ts but for SQL generation.
 */
export const PRICE_FIELDS: PriceFieldConfig[] = [
  // Student counts
  {
    reportColumn: 'how_many_students',
    priceColumn: 'seminar_student',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportColumn: 'how_many_students',
    priceColumn: 'kinder_student',
    teacherTypes: [TeacherTypeId.KINDERGARTEN],
  },
  {
    reportColumn: 'how_many_students_teached',
    priceColumn: 'manha_student',
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportColumn: 'how_many_students_teached',
    priceColumn: 'special_student',
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  {
    reportColumn: 'how_many_students_watched',
    priceColumn: 'special_student',
    factor: 0.5,
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  {
    reportColumn: 'how_many_students_help_teached',
    priceColumn: 'manha_help',
    teacherTypes: [TeacherTypeId.MANHA],
  },

  // Lesson counts
  {
    reportColumn: 'how_many_lessons',
    priceColumn: 'seminar_lesson',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportColumn: 'how_many_lessons',
    priceColumn: 'special_lesson',
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  {
    reportColumn: 'how_many_yalkut_lessons',
    priceColumn: 'manha_yalkut',
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportColumn: 'how_many_discussing_lessons',
    priceColumn: 'seminar_discuss',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportColumn: 'how_many_discussing_lessons',
    priceColumn: 'manha_discuss',
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportColumn: 'how_many_discussing_lessons',
    priceColumn: 'pds_discuss',
    teacherTypes: [TeacherTypeId.PDS],
  },
  {
    reportColumn: 'how_many_watched_lessons',
    priceColumn: 'manha_watched',
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportColumn: 'how_many_watch_or_individual',
    priceColumn: 'seminar_watch',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportColumn: 'how_many_watch_or_individual',
    priceColumn: 'pds_watch',
    teacherTypes: [TeacherTypeId.PDS],
  },
  {
    reportColumn: 'how_many_teached_or_interfering',
    priceColumn: 'seminar_interfere',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportColumn: 'how_many_teached_or_interfering',
    priceColumn: 'pds_interfere',
    teacherTypes: [TeacherTypeId.PDS],
  },

  // Methodic
  {
    reportColumn: 'how_many_methodic',
    priceColumn: 'manha_methodic',
    teacherTypes: [TeacherTypeId.MANHA],
  },

  // Absences (negative factor)
  {
    reportColumn: 'how_many_lessons_absence',
    priceColumn: 'seminar_lesson',
    factor: -0.5,
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },

  // Boolean bonuses
  {
    reportColumn: 'was_phone_discussing',
    priceColumn: 'special_phone',
    isBonus: true,
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  {
    reportColumn: 'was_kamal',
    priceColumn: 'seminar_kamal',
    isBonus: true,
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportColumn: 'was_collective_watch',
    priceColumn: 'kinder_collective',
    isBonus: true,
    teacherTypes: [TeacherTypeId.KINDERGARTEN],
  },
  {
    reportColumn: 'is_taarif_hulia',
    priceColumn: 'manha_hulia1',
    isBonus: true,
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportColumn: 'is_taarif_hulia2',
    priceColumn: 'manha_hulia2',
    isBonus: true,
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportColumn: 'is_taarif_hulia3',
    priceColumn: 'manha_hulia3',
    isBonus: true,
    teacherTypes: [TeacherTypeId.MANHA],
  },
];

/**
 * Generate SQL for the total price calculation per teacher type.
 * Uses CASE WHEN for each teacher type to sum applicable fields.
 */
function generateTotalPriceByTeacherType(): string {
  const teacherTypes = [
    TeacherTypeId.SEMINAR_KITA,
    TeacherTypeId.MANHA,
    TeacherTypeId.PDS,
    TeacherTypeId.KINDERGARTEN,
    TeacherTypeId.SPECIAL_EDUCATION,
  ];

  const cases = teacherTypes.map((tt) => {
    const applicableFields = PRICE_FIELDS.filter((f) => f.teacherTypes.includes(tt));
    if (applicableFields.length === 0) {
      return `WHEN ${tt} THEN 0`;
    }

    const components = applicableFields.map((f) => {
      const factor = f.factor ?? 1;
      const priceExpr = factor !== 1 ? `up.${f.priceColumn} * ${factor}` : `up.${f.priceColumn}`;
      return `COALESCE(r.${f.reportColumn} * ${priceExpr}, 0)`;
    });

    return `WHEN ${tt} THEN -- ${TeacherTypeId[tt]}
            ${components.join(' +\n            ')}`;
  });

  return `CASE tt.\`key\`
          ${cases.join('\n          ')}
          ELSE 0
        END`;
}

/**
 * Generate the full SQL expression for AttReportWithPrice view.
 * Simplified: only calculatedPrice, no subtotal columns.
 * Price explanation is calculated on the frontend.
 */
export function generateAttReportWithPriceSQL(): string {
  return `
    SELECT
      r.id,
      r.user_id AS userId,
      r.teacherReferenceId,
      r.teacherTz,
      r.report_date AS reportDate,
      r.salary_report_id AS salaryReportId,
      r.year,
      r.createdAt,
      r.updatedAt,
      t.teacherTypeReferenceId,
      tt.\`key\` AS teacherTypeKey,
      
      -- Total calculated price (base + components, minimum 0)
      GREATEST(0,
        COALESCE(up.lesson_base, 0) +
        ${generateTotalPriceByTeacherType()}
      ) AS calculatedPrice
      
    FROM att_reports r
    INNER JOIN teachers t ON t.id = r.teacherReferenceId AND t.user_id = r.user_id
    INNER JOIN teacher_types tt ON tt.id = t.teacherTypeReferenceId AND tt.user_id = r.user_id
    INNER JOIN user_price_pivot up ON up.userId = r.user_id
  `;
}

/**
 * AttReportWithPrice view entity - calculates prices for attendance reports.
 *
 * Features:
 * - Total calculated price with GREATEST(0, ...) to prevent negative values
 * - Efficient: uses user_price_pivot (single join) instead of 20+ price joins
 * - Price explanation is calculated on the frontend using PRICE_FIELDS config
 *
 * Performance: ~20ms for 113 reports, scales linearly
 */
@ViewEntity({
  name: 'att_report_with_price',
  expression: generateAttReportWithPriceSQL(),
})
export class AttReportWithPrice implements IHasUserId {
  @PrimaryColumn()
  @ViewColumn()
  id: number;

  @ViewColumn()
  userId: number;

  @ViewColumn()
  teacherReferenceId: number;

  @ViewColumn()
  teacherTz: string;

  @ViewColumn()
  reportDate: Date;

  @ViewColumn()
  salaryReportId: number | null;

  @ViewColumn()
  year: number;

  @ViewColumn()
  createdAt: Date;

  @ViewColumn()
  updatedAt: Date;

  @ViewColumn()
  teacherTypeReferenceId: number;

  @ViewColumn()
  teacherTypeKey: number;

  @ViewColumn()
  calculatedPrice: number;

  // Relations
  @ManyToOne(() => Teacher, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'teacherReferenceId' })
  teacher: Teacher;

  @ManyToOne(() => SalaryReport, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'salaryReportId' })
  salaryReport: SalaryReport;
}
