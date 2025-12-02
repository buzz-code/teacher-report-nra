// Teacher type IDs matching server-side enum
export const TeacherTypeId = {
  SEMINAR_KITA: 1,
  TRAINING: 2, // not in use
  MANHA: 3,
  RESPONSIBLE: 4, // not in use
  PDS: 5,
  KINDERGARTEN: 6,
  SPECIAL_EDUCATION: 7,
};

// Field visibility configuration based on teacher type
export const fieldVisibility = {
  // SEMINAR_KITA, KINDERGARTEN
  howManyStudents: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.KINDERGARTEN],

  // SEMINAR_KITA, SPECIAL_EDUCATION
  howManyLessons: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.SPECIAL_EDUCATION],

  // SEMINAR_KITA, PDS
  howManyWatchOrIndividual: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.PDS],
  howManyTeachedOrInterfering: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.PDS],

  // SEMINAR_KITA only
  wasKamal: [TeacherTypeId.SEMINAR_KITA],
  howManyLessonsAbsence: [TeacherTypeId.SEMINAR_KITA],

  // SEMINAR_KITA, MANHA, PDS
  howManyDiscussingLessons: [TeacherTypeId.SEMINAR_KITA, TeacherTypeId.MANHA, TeacherTypeId.PDS],

  // MANHA only
  howManyMethodic: [TeacherTypeId.MANHA],
  // fourLastDigitsOfTeacherPhone: [TeacherTypeId.MANHA],
  // isTaarifHulia: [TeacherTypeId.MANHA],
  // isTaarifHulia2: [TeacherTypeId.MANHA],
  // isTaarifHulia3: [TeacherTypeId.MANHA],
  // howManyWatchedLessons: [TeacherTypeId.MANHA],
  // teachedStudentTz: [TeacherTypeId.MANHA],
  // howManyYalkutLessons: [TeacherTypeId.MANHA],
  // howManyStudentsHelpTeached: [TeacherTypeId.MANHA],
  // teacherToReportFor: [TeacherTypeId.MANHA],

  // MANHA, SPECIAL_EDUCATION
  howManyStudentsTeached: [TeacherTypeId.MANHA, TeacherTypeId.SPECIAL_EDUCATION],

  // KINDERGARTEN only
  wasCollectiveWatch: [TeacherTypeId.KINDERGARTEN],
  wasStudentsGood: [TeacherTypeId.KINDERGARTEN],

  // SPECIAL_EDUCATION only
  howManyStudentsWatched: [TeacherTypeId.SPECIAL_EDUCATION],
  wasPhoneDiscussing: [TeacherTypeId.SPECIAL_EDUCATION],
  whoIsYourTrainingTeacher: [TeacherTypeId.SPECIAL_EDUCATION],
  whatIsYourSpeciality: [TeacherTypeId.SPECIAL_EDUCATION],
};

/**
 * Check if a field should be shown for the current teacher type
 * @param {string} fieldName - The field name to check
 * @param {number|null} teacherTypeKey - The teacher type key (ID)
 * @returns {boolean} - True if the field should be shown
 */
export const shouldShowField = (fieldName, teacherTypeKey) => {
  // Show all fields if teacher type not yet loaded
  if (!teacherTypeKey) return true;

  // If field is not in visibility config, show it (universal field)
  if (!fieldVisibility[fieldName]) return true;

  // Check if the teacher type is in the allowed list for this field
  return fieldVisibility[fieldName].includes(teacherTypeKey);
};

/**
 * Get all fields that should be shown for a specific teacher type
 * @param {number|null} teacherTypeKey - The teacher type key (ID)
 * @returns {string[]} - Array of field names that should be shown
 */
export const getVisibleFields = (teacherTypeKey) => {
  if (!teacherTypeKey) {
    // Return all fields if no teacher type specified
    return Object.keys(fieldVisibility);
  }

  return Object.keys(fieldVisibility).filter(fieldName =>
    fieldVisibility[fieldName].includes(teacherTypeKey)
  );
};

/**
 * Fetch teacher type key from teacher type ID using data provider
 * @param {Object} dataProvider - React Admin data provider
 * @param {number|null} teacherTypeId - The teacher type ID
 * @returns {Promise<number|null>} - The teacher type key or null
 */
export const getTeacherTypeKeyByTeacherTypeId = (dataProvider, teacherTypeId) => {
  if (!teacherTypeId) return Promise.resolve(null);
  return dataProvider.getOne('teacher_type', { id: teacherTypeId })
    .then(response => response?.data?.key || null)
    .catch((error) => {
      console.error('Error fetching teacher type:', error);
      return null;
    });
};

/**
 * Fetch teacher type key from teacher ID using data provider
 * @param {Object} dataProvider - React Admin data provider
 * @param {number|null} teacherId - The teacher ID
 * @returns {Promise<number|null>} - The teacher type key or null
 */
export const getTeacherTypeKeyByTeacherId = (dataProvider, teacherId) => {
  if (!teacherId) return Promise.resolve(null);
  return dataProvider.getOne('teacher', { id: teacherId })
    .then(response => getTeacherTypeKeyByTeacherTypeId(dataProvider, response?.data?.teacherTypeReferenceId))
    .catch((error) => {
      console.error('Error fetching teacher:', error);
      return null;
    });
};
