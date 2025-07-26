/**
 * Utility for determining field visibility based on teacher type
 * Based on YEMOT phone flow requirements for different teacher types
 */

import { AttReport } from '../db/entities/AttReport.entity';

/**
 * Interface for table headers - more specific than the shared IHeader
 */
export interface ITableHeader {
  value: string;
  label: string;
  sortable?: boolean;
}

/**
 * Teacher type constants based on the YEMOT flow documentation
 */
export enum TeacherTypeId {
  SEMINAR_KITA = 1,
  TRAINING = 2, // not in use
  MANHA = 3,
  RESPONSIBLE = 4, // not in use
  PDS = 5,
  KINDERGARTEN = 6,
  SPECIAL_EDUCATION = 7,
}

/**
 * Type for field names from AttReport entity
 */
export type AttReportField = keyof AttReport;

/**
 * Field mapping for each teacher type
 * Based on the YEMOT phone flow documentation requirements
 * Shared fields are duplicated across teacher types for simplicity
 */
const TEACHER_TYPE_FIELDS: Record<TeacherTypeId, AttReportField[]> = {
  [TeacherTypeId.SEMINAR_KITA]: [
    'howManyStudents', // shared with KINDERGARTEN
    'howManyLessons',
    'howManyWatchOrIndividual',
    'howManyTeachedOrInterfering',
    'wasKamal',
    'howManyDiscussingLessons', // shared with MANHA, PDS
    'howManyLessonsAbsence',
  ],
  [TeacherTypeId.TRAINING]: [], // not in use
  [TeacherTypeId.MANHA]: [
    // Self-reporting mode
    'howManyMethodic',
    // Reporting on others mode
    'fourLastDigitsOfTeacherPhone',
    'isTaarifHulia',
    'isTaarifHulia2',
    'isTaarifHulia3',
    'howManyWatchedLessons',
    'howManyStudentsTeached', // shared with SPECIAL_EDUCATION
    'howManyYalkutLessons',
    'howManyDiscussingLessons', // shared with SEMINAR_KITA, PDS
    'howManyStudentsHelpTeached',
    'teacherToReportFor',
  ],
  [TeacherTypeId.RESPONSIBLE]: [], // not in use
  [TeacherTypeId.PDS]: [
    'howManyWatchOrIndividual',
    'howManyTeachedOrInterfering',
    'howManyDiscussingLessons', // shared with SEMINAR_KITA, MANHA
  ],
  [TeacherTypeId.KINDERGARTEN]: [
    'wasCollectiveWatch',
    'howManyStudents', // shared with SEMINAR_KITA
    'wasStudentsGood',
  ],
  [TeacherTypeId.SPECIAL_EDUCATION]: [
    'howManyLessons',
    'howManyStudentsWatched',
    'howManyStudentsTeached', // shared with MANHA
    'wasPhoneDiscussing',
    'whatIsYourSpeciality',
  ],
};

/**
 * Universal fields that are relevant for all teacher types
 */
const UNIVERSAL_FIELDS: AttReportField[] = [
  'id',
  'userId',
  'teacherId',
  'reportDate',
  'updateDate',
  'year',
  'isConfirmed',
  'salaryReport',
  'salaryMonth',
  'comment',
  'createdAt',
  'updatedAt',
];

/**
 * Determines if a field should be shown for a specific teacher type
 * @param fieldName - The name of the field to check
 * @param teacherTypeId - The teacher type ID to check against
 * @returns true if the field should be shown, false otherwise
 */
export function shouldShowField(fieldName: AttReportField, teacherTypeId: number): boolean {
  // Check if it's a universal field (always shown)
  if (UNIVERSAL_FIELDS.includes(fieldName)) {
    return true;
  }

  // Check if the teacher type is valid
  if (!isValidTeacherType(teacherTypeId)) {
    return false;
  }

  // Check if the field is explicitly defined for this teacher type
  const teacherFields = TEACHER_TYPE_FIELDS[teacherTypeId] || [];
  return teacherFields.includes(fieldName);
}

/**
 * Validates if the teacher type ID is a known/valid type
 * @param teacherTypeId - The teacher type ID to validate
 * @returns true if valid, false otherwise
 */
export function isValidTeacherType(teacherTypeId: number): boolean {
  return Object.values(TeacherTypeId).includes(teacherTypeId);
}

/**
 * Gets all fields that should be shown for a specific teacher type
 * @param teacherTypeId - The teacher type ID
 * @returns Array of field names that should be shown
 */
export function getFieldsForTeacherType(teacherTypeId: number): AttReportField[] {
  if (!isValidTeacherType(teacherTypeId)) {
    return UNIVERSAL_FIELDS;
  }

  const teacherFields = TEACHER_TYPE_FIELDS[teacherTypeId] || [];
  return [...UNIVERSAL_FIELDS, ...teacherFields];
}

/**
 * Gets teacher types that use a specific field
 * @param fieldName - The field name to check
 * @returns Array of teacher type IDs that use this field
 */
export function getTeacherTypesForField(fieldName: AttReportField): number[] {
  if (UNIVERSAL_FIELDS.includes(fieldName)) {
    return Object.values(TeacherTypeId).filter((id) => typeof id === 'number') as number[];
  }

  const teacherTypes: number[] = [];

  // Check in teacher-specific fields
  Object.entries(TEACHER_TYPE_FIELDS).forEach(([typeId, fields]) => {
    if (fields.includes(fieldName)) {
      teacherTypes.push(Number(typeId));
    }
  });

  return [...new Set(teacherTypes)]; // Remove duplicates
}

/**
 * Get field labels in Hebrew for UI display
 */
export function getFieldLabels(): Record<AttReportField, string> {
  return {
    // Universal fields
    id: 'מזהה',
    userId: 'מזהה משתמש',
    teacherId: 'מזהה מורה',
    reportDate: 'תאריך דיווח',
    updateDate: 'תאריך עדכון',
    year: 'שנה',
    isConfirmed: 'מאושר',
    salaryReport: 'דוח משכורת',
    salaryMonth: 'חודש משכורת',
    comment: 'הערות',
    createdAt: 'נוצר ב',
    updatedAt: 'עודכן ב',

    // Teacher-specific fields
    howManyStudents: 'מספר תלמידים',
    howManyLessons: 'מספר שיעורים',
    howManyWatchOrIndividual: 'מספר צפיות או אישיות',
    howManyTeachedOrInterfering: 'מספר הוראות או התערבויות',
    wasKamal: 'האם היה כמל',
    howManyDiscussingLessons: 'מספר שיעורי דיון',
    howManyLessonsAbsence: 'מספר שיעורי היעדרות',
    howManyMethodic: 'מספר מתודיקות',
    fourLastDigitsOfTeacherPhone: '4 ספרות אחרונות טלפון מורה',
    isTaarifHulia: 'תעריף חוליה',
    isTaarifHulia2: 'תעריף חוליה 2',
    isTaarifHulia3: 'תעריף חוליה 3',
    howManyWatchedLessons: 'מספר שיעורים שנצפו',
    howManyStudentsTeached: 'מספר תלמידים שהורו',
    howManyYalkutLessons: 'מספר שיעורי ילקוט',
    howManyStudentsHelpTeached: 'מספר תלמידים עזרו בהוראה',
    teacherToReportFor: 'מורה לדווח עבור',
    wasCollectiveWatch: 'האם היה צפייה קבוצתית',
    wasStudentsGood: 'האם התלמידים היו טובים',
    howManyStudentsWatched: 'מספר תלמידים שנצפו',
    wasPhoneDiscussing: 'האם היה דיון טלפוני',
    whatIsYourSpeciality: 'מה ההתמחות שלך',
  } as Record<AttReportField, string>;
}

/**
 * Get teacher type choices for UI selection
 */
export function getTeacherTypeChoices(): { id: number; name: string }[] {
  return [
    { id: TeacherTypeId.SEMINAR_KITA, name: 'סמינר כיתה' },
    { id: TeacherTypeId.MANHA, name: 'מנהה' },
    { id: TeacherTypeId.PDS, name: 'פדס' },
    { id: TeacherTypeId.KINDERGARTEN, name: 'גן' },
    { id: TeacherTypeId.SPECIAL_EDUCATION, name: 'חינוך מיוחד' },
  ];
}

/**
 * Build headers for dynamic table rendering based on teacher type
 */
export function buildHeadersForTeacherType(teacherTypeId: number | null): ITableHeader[] {
  const fields = teacherTypeId ? getFieldsForTeacherType(teacherTypeId) : UNIVERSAL_FIELDS;
  const labels = getFieldLabels();

  return fields.map((field) => ({
    value: field,
    label: labels[field] || field,
    sortable: true,
  }));
}
