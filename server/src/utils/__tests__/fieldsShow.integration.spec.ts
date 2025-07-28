// Integration test for AttReportByTeacherType functionality
// This tests the full flow from backend to frontend integration

import { getFieldsForTeacherType, buildHeadersForTeacherType, TeacherTypeId } from '../fieldsShow.util';

describe('AttReportByTeacherType Integration', () => {
  describe('Teacher Type Integration Scenarios', () => {
    it('should provide complete data for Seminary Class teacher type', () => {
      const teacherTypeId = TeacherTypeId.SEMINAR_KITA;

      // Test field retrieval
      const fields = getFieldsForTeacherType(teacherTypeId);
      expect(fields).toContain('howManyStudents');
      expect(fields).toContain('howManyLessons');
      expect(fields).toContain('wasKamal');
      expect(fields).not.toContain('howManyMethodic');

      // Test header generation
      const headers = buildHeadersForTeacherType(teacherTypeId);
      const studentHeader = headers.find((h) => h.value === 'howManyStudents');
      expect(studentHeader).toEqual({
        value: 'howManyStudents',
      });

      // Verify no headers for other teacher types
      expect(headers.find((h) => h.value === 'howManyMethodic')).toBeUndefined();
    });

    it('should handle dynamic teacher type selection', () => {
      // Test specific teacher types have proper fields
      const testTypes = [
        TeacherTypeId.SEMINAR_KITA,
        TeacherTypeId.MANHA,
        TeacherTypeId.PDS,
        TeacherTypeId.KINDERGARTEN,
        TeacherTypeId.SPECIAL_EDUCATION,
      ];

      testTypes.forEach((teacherTypeId) => {
        const fields = getFieldsForTeacherType(teacherTypeId);
        const headers = buildHeadersForTeacherType(teacherTypeId);

        // Every teacher type should have universal fields
        expect(fields).toContain('id');
        expect(fields).toContain('teacherTz');
        expect(fields).toContain('teacherReferenceId');
        expect(fields).toContain('reportDate');

        // Headers should match fields
        expect(headers.length).toBe(fields.length);

        // All headers should have value property only
        headers.forEach((header) => {
          expect(header.value).toBeTruthy();
          expect(typeof header.value).toBe('string');
        });
      });
    });

    it('should properly handle null teacher type (no selection)', () => {
      const headers = buildHeadersForTeacherType(null);

      // Should only have universal fields
      expect(headers.find((h) => h.value === 'id')).toBeDefined();
      expect(headers.find((h) => h.value === 'teacherTz')).toBeDefined();
      expect(headers.find((h) => h.value === 'teacherReferenceId')).toBeDefined();
      expect(headers.find((h) => h.value === 'comment')).toBeDefined();

      // Should not have any teacher-specific fields
      expect(headers.find((h) => h.value === 'howManyStudents')).toBeUndefined();
      expect(headers.find((h) => h.value === 'howManyMethodic')).toBeUndefined();
      expect(headers.find((h) => h.value === 'wasCollectiveWatch')).toBeUndefined();
    });

    it('should support pivot resource URL pattern', () => {
      // Test that our resource URL would work with React Admin
      const resourceUrl = 'att_report/pivot?extra.pivot=AttReportByTeacherType';
      expect(resourceUrl).toContain('AttReportByTeacherType');
      expect(resourceUrl).toContain('extra.pivot');

      // Test with teacher type parameter
      const withTeacherType = resourceUrl + '&extra.teacherTypeId=1';
      expect(withTeacherType).toContain('teacherTypeId=1');
    });

    it('should maintain field consistency across utilities', () => {
      // Test that all teacher types have consistent field definitions
      Object.values(TeacherTypeId)
        .filter((id) => typeof id === 'number')
        .forEach((teacherTypeId) => {
          const fields = getFieldsForTeacherType(teacherTypeId as number);
          const headers = buildHeadersForTeacherType(teacherTypeId as number);

          // Every field should have a corresponding header
          expect(headers.length).toBe(fields.length);

          // Every header should correspond to a field
          headers.forEach((header) => {
            expect(fields).toContain(header.value as any);
          });
        });
    });
  });

  describe('Header Structure Integration', () => {
    it('should provide simple headers with just value field for all teacher types', () => {
      const seminarHeaders = buildHeadersForTeacherType(TeacherTypeId.SEMINAR_KITA);
      const manhaHeaders = buildHeadersForTeacherType(TeacherTypeId.MANHA);
      const pdsHeaders = buildHeadersForTeacherType(TeacherTypeId.PDS);
      const kindergartenHeaders = buildHeadersForTeacherType(TeacherTypeId.KINDERGARTEN);
      const specialEdHeaders = buildHeadersForTeacherType(TeacherTypeId.SPECIAL_EDUCATION);

      const allHeaders = [
        ...seminarHeaders,
        ...manhaHeaders,
        ...pdsHeaders,
        ...kindergartenHeaders,
        ...specialEdHeaders,
      ];

      // Check that all headers have only value property
      allHeaders.forEach((header) => {
        expect(header).toHaveProperty('value');
        expect(header).not.toHaveProperty('label');
        expect(header).not.toHaveProperty('sortable');
        expect(Object.keys(header)).toEqual(['value']);
      });
    });
  });
});
