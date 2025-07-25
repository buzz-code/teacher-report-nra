import {
  shouldShowField,
  isValidTeacherType,
  getFieldsForTeacherType,
  getTeacherTypesForField,
  TeacherTypeId,
  AttReportField,
} from '../fieldsShow.util';

describe('fieldsShow.util', () => {
  describe('shouldShowField', () => {
    describe('Universal fields', () => {
      const universalFields: AttReportField[] = [
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

      universalFields.forEach((field) => {
        it(`should show universal field "${field}" for all teacher types`, () => {
          Object.values(TeacherTypeId)
            .filter((id) => typeof id === 'number')
            .forEach((teacherTypeId) => {
              expect(shouldShowField(field, teacherTypeId as number)).toBe(true);
            });
        });
      });
    });

    describe('Seminar Kita Teachers (Type 1)', () => {
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      const expectedFields: AttReportField[] = [
        'howManyStudents',
        'howManyLessons',
        'howManyWatchOrIndividual',
        'howManyTeachedOrInterfering',
        'wasKamal',
        'howManyDiscussingLessons',
        'howManyLessonsAbsence',
      ];

      expectedFields.forEach((field) => {
        it(`should show field "${field}" for Seminar Kita teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(true);
        });
      });

      const unexpectedFields: AttReportField[] = [
        'howManyMethodic',
        'fourLastDigitsOfTeacherPhone',
        'isTaarifHulia',
        'wasCollectiveWatch',
        'wasPhoneDiscussing',
      ];

      unexpectedFields.forEach((field) => {
        it(`should not show field "${field}" for Seminar Kita teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(false);
        });
      });
    });

    describe('Manha Teachers (Type 3)', () => {
      const teacherTypeId = TeacherTypeId.MANHA;

      const expectedFields: AttReportField[] = [
        'howManyMethodic',
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
      ];

      expectedFields.forEach((field) => {
        it(`should show field "${field}" for Manha teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(true);
        });
      });

      const unexpectedFields: AttReportField[] = [
        'howManyLessons',
        'wasKamal',
        'wasCollectiveWatch',
        'wasPhoneDiscussing',
        'whatIsYourSpeciality',
      ];

      unexpectedFields.forEach((field) => {
        it(`should not show field "${field}" for Manha teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(false);
        });
      });
    });

    describe('PDS Teachers (Type 5)', () => {
      const teacherTypeId = TeacherTypeId.PDS;

      const expectedFields: AttReportField[] = [
        'howManyWatchOrIndividual',
        'howManyTeachedOrInterfering',
        'howManyDiscussingLessons',
      ];

      expectedFields.forEach((field) => {
        it(`should show field "${field}" for PDS teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(true);
        });
      });

      const unexpectedFields: AttReportField[] = [
        'howManyMethodic',
        'wasKamal',
        'howManyLessonsAbsence',
        'wasCollectiveWatch',
        'howManyStudentsWatched',
      ];

      unexpectedFields.forEach((field) => {
        it(`should not show field "${field}" for PDS teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(false);
        });
      });
    });

    describe('Kindergarten Teachers (Type 6)', () => {
      const teacherTypeId = TeacherTypeId.KINDERGARTEN;

      const expectedFields: AttReportField[] = ['wasCollectiveWatch', 'howManyStudents', 'wasStudentsGood'];

      expectedFields.forEach((field) => {
        it(`should show field "${field}" for Kindergarten teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(true);
        });
      });

      const unexpectedFields: AttReportField[] = [
        'howManyMethodic',
        'wasKamal',
        'howManyLessonsAbsence',
        'isTaarifHulia',
        'wasPhoneDiscussing',
      ];

      unexpectedFields.forEach((field) => {
        it(`should not show field "${field}" for Kindergarten teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(false);
        });
      });
    });

    describe('Special Education Teachers (Type 7)', () => {
      const teacherTypeId = TeacherTypeId.SPECIAL_EDUCATION;

      const expectedFields: AttReportField[] = [
        'howManyLessons',
        'howManyStudentsWatched',
        'howManyStudentsTeached',
        'wasPhoneDiscussing',
        'whatIsYourSpeciality',
      ];

      expectedFields.forEach((field) => {
        it(`should show field "${field}" for Special Education teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(true);
        });
      });

      const unexpectedFields: AttReportField[] = [
        'howManyMethodic',
        'wasKamal',
        'howManyLessonsAbsence',
        'wasCollectiveWatch',
        'isTaarifHulia',
      ];

      unexpectedFields.forEach((field) => {
        it(`should not show field "${field}" for Special Education teachers`, () => {
          expect(shouldShowField(field, teacherTypeId)).toBe(false);
        });
      });
    });

    describe('Shared fields', () => {
      it('should show howManyDiscussingLessons for Seminar Kita, Manha, and PDS teachers', () => {
        expect(shouldShowField('howManyDiscussingLessons', TeacherTypeId.SEMINAR_KITA)).toBe(true);
        expect(shouldShowField('howManyDiscussingLessons', TeacherTypeId.MANHA)).toBe(true);
        expect(shouldShowField('howManyDiscussingLessons', TeacherTypeId.PDS)).toBe(true);
        expect(shouldShowField('howManyDiscussingLessons', TeacherTypeId.KINDERGARTEN)).toBe(false);
        expect(shouldShowField('howManyDiscussingLessons', TeacherTypeId.SPECIAL_EDUCATION)).toBe(false);
      });

      it('should show howManyStudents for Seminar Kita and Kindergarten teachers', () => {
        expect(shouldShowField('howManyStudents', TeacherTypeId.SEMINAR_KITA)).toBe(true);
        expect(shouldShowField('howManyStudents', TeacherTypeId.KINDERGARTEN)).toBe(true);
        expect(shouldShowField('howManyStudents', TeacherTypeId.MANHA)).toBe(false);
        expect(shouldShowField('howManyStudents', TeacherTypeId.PDS)).toBe(false);
        expect(shouldShowField('howManyStudents', TeacherTypeId.SPECIAL_EDUCATION)).toBe(false);
      });

      it('should show howManyStudentsTeached for Manha and Special Education teachers', () => {
        expect(shouldShowField('howManyStudentsTeached', TeacherTypeId.MANHA)).toBe(true);
        expect(shouldShowField('howManyStudentsTeached', TeacherTypeId.SPECIAL_EDUCATION)).toBe(true);
        expect(shouldShowField('howManyStudentsTeached', TeacherTypeId.SEMINAR_KITA)).toBe(false);
        expect(shouldShowField('howManyStudentsTeached', TeacherTypeId.PDS)).toBe(false);
        expect(shouldShowField('howManyStudentsTeached', TeacherTypeId.KINDERGARTEN)).toBe(false);
      });
    });

    describe('Invalid teacher types', () => {
      it('should return false for invalid teacher type IDs', () => {
        expect(shouldShowField('howManyStudents', 99)).toBe(false);
        expect(shouldShowField('howManyStudents', -1)).toBe(false);
        expect(shouldShowField('howManyStudents', 0)).toBe(false);
      });

      it('should return true for universal fields even with invalid teacher types', () => {
        expect(shouldShowField('id', 99)).toBe(true);
        expect(shouldShowField('userId', -1)).toBe(true);
        expect(shouldShowField('comment', 0)).toBe(true);
      });
    });

    describe('Training and Responsible teachers (not in use)', () => {
      it('should only show universal fields for Training teachers (Type 2)', () => {
        expect(shouldShowField('id', TeacherTypeId.TRAINING)).toBe(true);
        expect(shouldShowField('howManyStudents', TeacherTypeId.TRAINING)).toBe(false);
        expect(shouldShowField('howManyMethodic', TeacherTypeId.TRAINING)).toBe(false);
      });

      it('should only show universal fields for Responsible teachers (Type 4)', () => {
        expect(shouldShowField('id', TeacherTypeId.RESPONSIBLE)).toBe(true);
        expect(shouldShowField('howManyStudents', TeacherTypeId.RESPONSIBLE)).toBe(false);
        expect(shouldShowField('howManyMethodic', TeacherTypeId.RESPONSIBLE)).toBe(false);
      });
    });
  });

  describe('isValidTeacherType', () => {
    it('should return true for valid teacher type IDs', () => {
      expect(isValidTeacherType(TeacherTypeId.SEMINAR_KITA)).toBe(true);
      expect(isValidTeacherType(TeacherTypeId.TRAINING)).toBe(true);
      expect(isValidTeacherType(TeacherTypeId.MANHA)).toBe(true);
      expect(isValidTeacherType(TeacherTypeId.RESPONSIBLE)).toBe(true);
      expect(isValidTeacherType(TeacherTypeId.PDS)).toBe(true);
      expect(isValidTeacherType(TeacherTypeId.KINDERGARTEN)).toBe(true);
      expect(isValidTeacherType(TeacherTypeId.SPECIAL_EDUCATION)).toBe(true);
    });

    it('should return false for invalid teacher type IDs', () => {
      expect(isValidTeacherType(0)).toBe(false);
      expect(isValidTeacherType(8)).toBe(false);
      expect(isValidTeacherType(-1)).toBe(false);
      expect(isValidTeacherType(99)).toBe(false);
    });
  });

  describe('getFieldsForTeacherType', () => {
    it('should return all relevant fields for Seminar Kita teachers', () => {
      const fields = getFieldsForTeacherType(TeacherTypeId.SEMINAR_KITA);

      // Should include universal fields
      expect(fields).toContain('id');
      expect(fields).toContain('userId');
      expect(fields).toContain('comment');

      // Should include teacher-specific fields
      expect(fields).toContain('howManyStudents');
      expect(fields).toContain('howManyLessons');
      expect(fields).toContain('wasKamal');

      // Should include shared fields
      expect(fields).toContain('howManyDiscussingLessons');

      // Should not include fields for other types
      expect(fields).not.toContain('howManyMethodic');
      expect(fields).not.toContain('wasCollectiveWatch');
    });

    it('should return all relevant fields for Manha teachers', () => {
      const fields = getFieldsForTeacherType(TeacherTypeId.MANHA);

      expect(fields).toContain('id');
      expect(fields).toContain('howManyMethodic');
      expect(fields).toContain('isTaarifHulia');
      expect(fields).toContain('howManyDiscussingLessons');
      expect(fields).toContain('howManyStudentsTeached');

      expect(fields).not.toContain('wasKamal');
      expect(fields).not.toContain('wasCollectiveWatch');
    });

    it('should return only universal fields for invalid teacher types', () => {
      const fields = getFieldsForTeacherType(99);

      expect(fields).toContain('id');
      expect(fields).toContain('userId');
      expect(fields).toContain('comment');

      expect(fields).not.toContain('howManyStudents');
      expect(fields).not.toContain('howManyMethodic');
    });
  });

  describe('getTeacherTypesForField', () => {
    it('should return all teacher types for universal fields', () => {
      const types = getTeacherTypesForField('id');
      expect(types).toContain(TeacherTypeId.SEMINAR_KITA);
      expect(types).toContain(TeacherTypeId.MANHA);
      expect(types).toContain(TeacherTypeId.PDS);
      expect(types).toContain(TeacherTypeId.KINDERGARTEN);
      expect(types).toContain(TeacherTypeId.SPECIAL_EDUCATION);
      expect(types.length).toBe(7); // All teacher types
    });

    it('should return specific teacher types for teacher-specific fields', () => {
      const types = getTeacherTypesForField('wasKamal');
      expect(types).toContain(TeacherTypeId.SEMINAR_KITA);
      expect(types).toHaveLength(1);
    });

    it('should return multiple teacher types for shared fields', () => {
      const types = getTeacherTypesForField('howManyDiscussingLessons');
      expect(types).toContain(TeacherTypeId.SEMINAR_KITA);
      expect(types).toContain(TeacherTypeId.MANHA);
      expect(types).toContain(TeacherTypeId.PDS);
      expect(types).toHaveLength(3);
    });

    it('should return empty array for fields not used by any teacher type', () => {
      const types = getTeacherTypesForField('teachedStudentTz');
      expect(types).toEqual([]);
    });

    it('should not return duplicates for fields defined in both specific and shared', () => {
      const types = getTeacherTypesForField('howManyStudentsTeached');
      expect(types).toContain(TeacherTypeId.MANHA);
      expect(types).toContain(TeacherTypeId.SPECIAL_EDUCATION);
      expect(types).toHaveLength(2);

      // Check that each type appears only once
      const uniqueTypes = [...new Set(types)];
      expect(types.length).toBe(uniqueTypes.length);
    });
  });
});
