/**
 * Yemot Handler Service - Flow Tests
 * 
 * This file tests complete call flows using the scenario builder infrastructure.
 * Each test represents a complete user journey through the IVR system.
 */

import { runScenario } from './helpers/yemot-test-scenario-runner';
import { scenario } from './helpers/yemot-scenario-builder';
import { TeacherTypeId } from '../utils/fieldsShow.util';

describe('YemotHandlerService - Complete Flow Tests', () => {
  
  describe('SEMINAR_KITA Teacher Flows', () => {
    it('should complete full report flow with valid data', async () => {
      const today = new Date();

      const testScenario = scenario('SEMINAR_KITA - Complete valid report')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.SEMINAR_KITA,
        })
        .withWorkingDates([today])
        .withStudents(5)
        .withStandardTexts(TeacherTypeId.SEMINAR_KITA)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          howManyStudents: 5,
          howManyLessons: 6,
          howManyWatchOrIndividual: 2,
          howManyTeachedOrInterfering: 2,
          wasKamal: true,
          howManyDiscussingLessons: 1,
          howManyLessonsAbsence: 0,
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it.todo('should complete flow with multiple date reporting');
    it.todo('should reject and retry when lesson count does not match formula');
    it.todo('should reject and retry when absences exceed 10 total');
  });

  describe('MANHA Teacher Flows', () => {
    it('should complete MANHA Type 1: Self-report with methodic lessons', async () => {
      const today = new Date();

      const testScenario = scenario('MANHA Type 1 - Self-report')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מנחה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.MANHA,
        })
        .withWorkingDates([today])
        .withStandardTexts(TeacherTypeId.MANHA)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .systemAsks({ contains: 'עצמך או על מורות אחרות' }, '1', 'Report type: self (1)')
        .systemAsks({ contains: 'מתודיקה' }, '3', 'Methodic lessons')
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          howManyMethodic: 3,
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it.todo('should complete MANHA Type 2: Report on other teacher with teacher lookup');
    it.todo('should complete MANHA Type 2: With multiple student TZ collection');
    it.todo('should allow reporting on another teacher after completion');
  });

  describe('Other Teacher Types Flows', () => {
    it('should complete PDS report with watch/teach/discuss fields', async () => {
      const today = new Date();

      const testScenario = scenario('PDS - Complete valid report')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורת פידיאס',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.PDS,
        })
        .withWorkingDates([today])
        .withStandardTexts(TeacherTypeId.PDS)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .pdsDataFlow({
          watch: 3,
          teach: 2,
          discuss: 1,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          howManyWatchOrIndividual: 3,
          howManyTeachedOrInterfering: 2,
          howManyDiscussingLessons: 1,
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it('should complete KINDERGARTEN report with collective watch', async () => {
      const today = new Date();

      const testScenario = scenario('KINDERGARTEN - Collective watch')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'גננת טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.KINDERGARTEN,
        })
        .withWorkingDates([today])
        .withStandardTexts(TeacherTypeId.KINDERGARTEN)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .systemAsks({ contains: 'צפיה קולקטיבית' }, '1', 'Collective watch: yes')
        // NOTE: When collective watch is YES, the system does NOT ask about students count or performance
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          wasCollectiveWatch: true,
          // These fields are NOT collected for collective watch:
          // howManyStudents: should be null
          // wasStudentsGood: should be false (default)
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it('should complete KINDERGARTEN report with individual watch and student performance', async () => {
      const today = new Date();

      const testScenario = scenario('KINDERGARTEN - Individual watch')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'גננת טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.KINDERGARTEN,
        })
        .withWorkingDates([today])
        .withStandardTexts(TeacherTypeId.KINDERGARTEN)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .systemAsks({ contains: 'צפיה קולקטיבית' }, '0', 'Collective watch: no')
        .systemAsks({ contains: 'כמה בנות' }, '3', 'Number of students')
        .systemAsks({ contains: 'ענה על ציפיותיך' }, '0', 'Performance good: no')
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          wasCollectiveWatch: false,
          howManyStudents: 3,
          wasStudentsGood: false,
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it.todo('should complete SPECIAL_EDUCATION report with all fields (OOM issue - needs investigation)');
  });

  describe('Show Reports Flow', () => {
    it.todo('should display previous reports for selected month');
    it.todo('should handle no reports found for month');
  });

  describe('Validation & Error Handling', () => {
    it('should reject future date and retry date selection', async () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tomorrowStr = `${String(tomorrow.getDate()).padStart(2, '0')}${String(tomorrow.getMonth() + 1).padStart(2, '0')}${tomorrow.getFullYear()}`;
      const todayStr = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

      const testScenario = scenario('Date validation - Future date rejected')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.SEMINAR_KITA,
        })
        .withWorkingDates([today])
        .withStudents(5)
        .withStandardTexts(TeacherTypeId.SEMINAR_KITA)
        .addText('VALIDATION.FUTURE_DATE', 'לא ניתן לדווח על תאריך עתידי')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .systemAsks({ contains: 'תאריך' }, tomorrowStr, 'Enter future date')
        .systemSends({ contains: 'עתידי' }, 'Future date error')
        .systemAsks({ contains: 'תאריך' }, todayStr, 'Enter today date')
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm date')
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it('should reject non-working date and retry date selection', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const yesterdayStr = `${String(yesterday.getDate()).padStart(2, '0')}${String(yesterday.getMonth() + 1).padStart(2, '0')}${yesterday.getFullYear()}`;
      const todayStr = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

      const testScenario = scenario('Date validation - Non-working date rejected')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.SEMINAR_KITA,
        })
        .withWorkingDates([today]) // Only today is a working date
        .withStudents(5)
        .withStandardTexts(TeacherTypeId.SEMINAR_KITA)
        .addText('VALIDATION.NOT_WORKING_DATE', 'התאריך אינו תאריך עבודה')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .systemAsks({ contains: 'תאריך' }, yesterdayStr, 'Enter non-working date')
        .systemSends({ contains: 'אינו תאריך עבודה' }, 'Non-working date error')
        .systemAsks({ contains: 'תאריך' }, todayStr, 'Enter working date')
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm date')
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it('should allow user to reject date confirmation and retry', async () => {
      const today = new Date();
      const todayStr = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

      const testScenario = scenario('Date validation - User rejects confirmation')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.SEMINAR_KITA,
        })
        .withWorkingDates([today])
        .withStudents(5)
        .withStandardTexts(TeacherTypeId.SEMINAR_KITA)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .systemAsks({ contains: 'תאריך' }, todayStr, 'Enter date')
        .systemAsks({ contains: 'לאישור' }, '2', 'Reject date')
        .systemAsks({ contains: 'תאריך' }, todayStr, 'Re-enter date')
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm date')
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it('should handle invalid date format and retry', async () => {
      const today = new Date();
      const invalidDateStr = '99999999'; // Invalid date: 99th day of 99th month
      const todayStr = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

      const testScenario = scenario('Date validation - Invalid format rejected')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.SEMINAR_KITA,
        })
        .withWorkingDates([today])
        .withStudents(5)
        .withStandardTexts(TeacherTypeId.SEMINAR_KITA)
        .addText('VALIDATION.INVALID_DATE', 'תאריך לא חוקי')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .systemAsks({ contains: 'תאריך' }, invalidDateStr, 'Enter invalid date')
        .systemSends({ contains: 'לא חוקי' }, 'Invalid date error')
        .systemAsks({ contains: 'תאריך' }, todayStr, 'Enter valid date')
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm date')
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it.todo('should reject date with existing confirmed report');
    it.todo('should reject date with salary report');
  });

  describe('Report Confirmation & Retry', () => {
    it('should allow teacher to reject confirmation and restart data collection', async () => {
      const today = new Date();

      const testScenario = scenario('Report confirmation - Reject and retry')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורה טסט',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.SEMINAR_KITA,
        })
        .withWorkingDates([today])
        .withStudents(5)
        .withStandardTexts(TeacherTypeId.SEMINAR_KITA)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        // First attempt - wrong data
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '2', 'Reject report')
        // Second attempt - correct data
        .seminarKitaDataFlow({
          lessons: 8,
          watch: 3,
          teach: 3,
          kamal: false,
          discuss: 2,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          howManyStudents: 5,
          howManyLessons: 8,
          howManyWatchOrIndividual: 3,
          howManyTeachedOrInterfering: 3,
          wasKamal: false,
          howManyDiscussingLessons: 2,
          howManyLessonsAbsence: 0,
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });

    it('should allow PDS teacher to reject confirmation and retry', async () => {
      const today = new Date();

      const testScenario = scenario('PDS - Reject confirmation and retry')
        .withUser({
          id: 1,
          phoneNumber: '035586526',
          username: 'test-user',
        })
        .withTeacher({
          id: 1,
          userId: 1,
          name: 'מורת פידיאס',
          phone: '0527609942',
          teacherTypeKey: TeacherTypeId.PDS,
        })
        .withWorkingDates([today])
        .withStandardTexts(TeacherTypeId.PDS)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        // First attempt - wrong data
        .pdsDataFlow({
          watch: 2,
          teach: 1,
          discuss: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '2', 'Reject report')
        // Second attempt - correct data
        .pdsDataFlow({
          watch: 4,
          teach: 3,
          discuss: 2,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm report')
        .systemSends(undefined, 'Success message')
        .systemHangsUp(undefined, 'Goodbye')
        .expectSavedReport({
          userId: 1,
          teacherReferenceId: 1,
          isConfirmed: true,
          howManyWatchOrIndividual: 4,
          howManyTeachedOrInterfering: 3,
          howManyDiscussingLessons: 2,
        })
        .expectCallEnded(true)
        .build();

      await runScenario(testScenario);
    });
  });

  describe('Questions System', () => {
    it.todo('should ask mandatory question and save answer');
    it.todo('should prevent skipping mandatory question with * key');
    it.todo('should allow skipping optional question with * key');
    it.todo('should validate answer within range (lowerLimit/upperLimit)');
    it.todo('should retry when answer is out of range');
    it.todo('should process multiple questions in sequence');
  });

  describe('Teacher & Student Lookup', () => {
    it.todo('should find teacher by 4 last digits - single match');
    it.todo('should find teacher by 4 last digits - multiple matches with selection');
    it.todo('should handle no teacher found by 4 last digits');
    it.todo('should collect student TZ with confirmation');
    it.todo('should handle student not found and retry');
    it.todo('should collect multiple student TZs in loop');
  });
});
