/**
 * Frontend price calculation utility.
 * Mirrors the backend pricing logic for generating price explanations.
 */

// Teacher type IDs (matches server/src/utils/fieldsShow.util.ts)
export const TeacherTypeId = {
  SEMINAR_KITA: 1,
  TRAINING: 2, // Not in use
  MANHA: 3,
  RESPONSIBLE: 4, // Not in use
  PDS: 5,
  KINDERGARTEN: 6,
  SPECIAL_EDUCATION: 7,
};

/**
 * Price field configuration for price calculation.
 * Maps att_report fields to price codes.
 */
const PRICE_FIELDS = [
  // Student counts
  {
    reportField: 'howManyStudents',
    priceCode: 'seminar.student_multiplier',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportField: 'howManyStudents',
    priceCode: 'kindergarten.student_multiplier',
    teacherTypes: [TeacherTypeId.KINDERGARTEN],
  },
  // {
  //   reportField: 'howManyStudentsTeached',
  //   priceCode: 'manha.student_multiplier',
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },
  {
    reportField: 'howManyStudentsTeached',
    priceCode: 'special.student_multiplier',
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  {
    reportField: 'howManyStudentsWatched',
    priceCode: 'special.student_multiplier',
    factor: 0.5,
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  // {
  //   reportField: 'howManyStudentsHelpTeached',
  //   priceCode: 'manha.help_taught_multiplier',
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },

  // Lesson counts
  {
    reportField: 'howManyLessons',
    priceCode: 'seminar.lesson_multiplier',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },
  {
    reportField: 'howManyLessons',
    priceCode: 'special.lesson_multiplier',
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  // {
  //   reportField: 'howManyYalkutLessons',
  //   priceCode: 'manha.yalkut_lesson_multiplier',
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },
  {
    reportField: 'howManyDiscussingLessons',
    priceCode: 'seminar.discussing_lesson_multiplier',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
    multiplyByStudents: true,
  },
  {
    reportField: 'howManyDiscussingLessons',
    priceCode: 'manha.discussing_lesson_multiplier',
    teacherTypes: [TeacherTypeId.MANHA],
  },
  {
    reportField: 'howManyDiscussingLessons',
    priceCode: 'pds.discussing_lesson_multiplier',
    teacherTypes: [TeacherTypeId.PDS],
  },
  // {
  //   reportField: 'howManyWatchedLessons',
  //   priceCode: 'manha.watched_lesson_multiplier',
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },
  {
    reportField: 'howManyWatchOrIndividual',
    priceCode: 'seminar.watch_individual_multiplier',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
    multiplyByStudents: true,
  },
  {
    reportField: 'howManyWatchOrIndividual',
    priceCode: 'pds.watch_individual_multiplier',
    teacherTypes: [TeacherTypeId.PDS],
  },
  {
    reportField: 'howManyTeachedOrInterfering',
    priceCode: 'seminar.interfere_teach_multiplier',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
    multiplyByStudents: true,
  },
  {
    reportField: 'howManyTeachedOrInterfering',
    priceCode: 'pds.interfere_teach_multiplier',
    teacherTypes: [TeacherTypeId.PDS],
  },

  // Methodic
  {
    reportField: 'howManyMethodic',
    priceCode: 'manha.methodic_multiplier',
    teacherTypes: [TeacherTypeId.MANHA],
  },

  // Absences
  {
    reportField: 'howManyLessonsAbsence',
    priceCode: 'seminar.absence_multiplier',
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
  },

  // Boolean bonuses
  {
    reportField: 'wasPhoneDiscussing',
    priceCode: 'special.phone_discussion_bonus',
    isBonus: true,
    teacherTypes: [TeacherTypeId.SPECIAL_EDUCATION],
  },
  {
    reportField: 'wasKamal',
    priceCode: 'seminar.kamal_bonus',
    isBonus: true,
    teacherTypes: [TeacherTypeId.SEMINAR_KITA],
    multiplyByStudents: true,
  },
  {
    reportField: 'wasCollectiveWatch',
    priceCode: 'kindergarten.collective_watch_bonus',
    isBonus: true,
    teacherTypes: [TeacherTypeId.KINDERGARTEN],
  },
  // {
  //   reportField: 'isTaarifHulia',
  //   priceCode: 'manha.taarif_hulia_bonus',
  //   isBonus: true,
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },
  // {
  //   reportField: 'isTaarifHulia2',
  //   priceCode: 'manha.taarif_hulia2_bonus',
  //   isBonus: true,
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },
  // {
  //   reportField: 'isTaarifHulia3',
  //   priceCode: 'manha.taarif_hulia3_bonus',
  //   isBonus: true,
  //   teacherTypes: [TeacherTypeId.MANHA],
  // },
];

/**
 * Price explanation component.
 */
export const PriceComponent = {
  fieldKey: '', // For translation lookup
  value: 0, // Quantity (for numeric fields)
  multiplier: 0, // Price per unit
  factor: 1, // Additional factor
  subtotal: 0, // Calculated amount
  isBonus: false, // Boolean bonus field
};

/**
 * Calculate price explanation for a report.
 * @param report - The attendance report data (from att_report resource)
 * @param teacherTypeKey - The teacher type ID
 * @param priceMap - Map of price codes to values (from user_price_pivot or price_by_user)
 * @returns Object with basePrice, components array, and totalPrice
 */
export function calculatePriceExplanation(report, teacherTypeKey, priceMap) {
  if (!teacherTypeKey || !priceMap) {
    return { basePrice: 0, components: [], totalPrice: 0 };
  }

  const basePrice = priceMap.get('lesson.base') ?? 0;
  let totalPrice = basePrice;
  const components = [];

  // Filter fields applicable to this teacher type
  const applicableFields = PRICE_FIELDS.filter((f) => f.teacherTypes.includes(teacherTypeKey));

  for (const field of applicableFields) {
    const value = report[field.reportField];
    const multiplier = priceMap.get(field.priceCode) ?? 0;
    let factor = field.factor ?? 1;

    if (field.multiplyByStudents) {
      factor *= report.howManyStudents || 0;
    }

    if (field.isBonus) {
      // Boolean bonus - add if truthy
      if (value) {
        const subtotal = multiplier * factor;
        totalPrice += subtotal;
        components.push({
          fieldKey: field.reportField,
          multiplier,
          factor: factor !== 1 ? factor : undefined,
          subtotal: Math.round(subtotal * 100) / 100,
          isBonus: true,
        });
      }
    } else {
      // Numeric field - multiply value by multiplier and factor
      if (value && value !== 0) {
        const subtotal = value * multiplier * factor;
        totalPrice += subtotal;
        components.push({
          fieldKey: field.reportField,
          value,
          multiplier,
          factor: factor !== 1 ? factor : undefined,
          subtotal: Math.round(subtotal * 100) / 100,
        });
      }
    }
  }

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    components,
    totalPrice: Math.max(0, Math.round(totalPrice * 100) / 100),
  };
}

/**
 * Convert price_by_user array to a Map for efficient lookup.
 * @param prices - Array of { code, price } objects
 * @returns Map of code to price
 */
export function createPriceMap(prices) {
  const map = new Map();
  if (prices && Array.isArray(prices)) {
    prices.forEach((p) => map.set(p.code, p.price));
  }
  return map;
}
