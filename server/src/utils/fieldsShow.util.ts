/**
 * Utility for determining field visibility based on teacher type
 * Based on YEMOT phone flow requirements for different teacher types
 */

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
 * Field mapping for each teacher type
 * Based on the YEMOT phone flow documentation requirements
 */
const TEACHER_TYPE_FIELDS = {
  [TeacherTypeId.SEMINAR_KITA]: [
    'howManyStudents',
    'howManyLessons',
    'howManyWatchOrIndividual',
    'howManyTeachedOrInterfering',
    'wasKamal',
    'howManyDiscussingLessons',
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
    'howManyStudentsTeached',
    'howManyYalkutLessons',
    'howManyDiscussingLessons',
    'howManyStudentsHelpTeached',
    'teacherToReportFor',
  ],
  [TeacherTypeId.RESPONSIBLE]: [], // not in use
  [TeacherTypeId.PDS]: ['howManyWatchOrIndividual', 'howManyTeachedOrInterfering', 'howManyDiscussingLessons'],
  [TeacherTypeId.KINDERGARTEN]: ['wasCollectiveWatch', 'howManyStudents', 'wasStudentsGood'],
  [TeacherTypeId.SPECIAL_EDUCATION]: [
    'howManyLessons',
    'howManyStudentsWatched',
    'howManyStudentsTeached',
    'wasPhoneDiscussing',
    'whoIsYourTrainingTeacher',
    'whatIsYourSpeciality',
  ],
};

/**
 * Shared fields that are used across multiple teacher types
 */
const SHARED_FIELDS = {
  howManyDiscussingLessons: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.MANHA, TeacherTypeId.PDS],
  howManyStudents: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.KINDERGARTEN],
  howManyStudentsTeached: [TeacherTypeId.MANHA, TeacherTypeId.SPECIAL_EDUCATION],
};

/**
 * Universal fields that are relevant for all teacher types
 */
const UNIVERSAL_FIELDS = [
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
export function shouldShowField(fieldName: string, teacherTypeId: number): boolean {
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
  if (teacherFields.includes(fieldName)) {
    return true;
  }

  // Check if it's a shared field
  const sharedFieldTypes = SHARED_FIELDS[fieldName];
  if (sharedFieldTypes && sharedFieldTypes.includes(teacherTypeId)) {
    return true;
  }

  return false;
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
export function getFieldsForTeacherType(teacherTypeId: number): string[] {
  if (!isValidTeacherType(teacherTypeId)) {
    return UNIVERSAL_FIELDS;
  }

  const teacherFields = TEACHER_TYPE_FIELDS[teacherTypeId] || [];
  const sharedFields = Object.entries(SHARED_FIELDS)
    .filter(([_, types]) => types.includes(teacherTypeId))
    .map(([fieldName, _]) => fieldName);

  return [...UNIVERSAL_FIELDS, ...teacherFields, ...sharedFields];
}

/**
 * Gets teacher types that use a specific field
 * @param fieldName - The field name to check
 * @returns Array of teacher type IDs that use this field
 */
export function getTeacherTypesForField(fieldName: string): number[] {
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

  // Check in shared fields
  const sharedFieldTypes = SHARED_FIELDS[fieldName];
  if (sharedFieldTypes) {
    teacherTypes.push(...sharedFieldTypes);
  }

  return [...new Set(teacherTypes)]; // Remove duplicates
}
