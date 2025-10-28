/**
 * Yemot Handler Service - Flow Tests
 *
 * This file tests complete call flows using the scenario builder infrastructure.
 * Each test represents a complete user journey through the IVR system.
 */

import { runScenario } from './helpers/yemot-test-scenario-runner';
import { scenario } from './helpers/yemot-scenario-builder';
import { TeacherTypeId } from '../utils/fieldsShow.util';

// ============================================================================
// Common Test Data
// ============================================================================

const DEFAULT_USER = {
  id: 1,
  phoneNumber: '035586526',
  username: 'test-user',
};

const DEFAULT_TEACHER_BASE = {
  id: 1,
  userId: DEFAULT_USER.id,
  name: 'מורה טסט',
  phone: '0527609942',
};

const createTeacher = (teacherTypeKey: TeacherTypeId, overrides = {}) => ({
  ...DEFAULT_TEACHER_BASE,
  teacherTypeKey,
  ...overrides,
});

// ============================================================================
// Date Utilities
// ============================================================================

const getToday = () => new Date();

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
};

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

const getDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const formatDateForInput = (date: Date) => {
  return `${String(date.getDate()).padStart(2, '0')}${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}${date.getFullYear()}`;
};

// ============================================================================
// Question Factories
// ============================================================================

const createQuestion = (overrides = {}) => {
  const today = getToday();
  return {
    id: 1,
    userId: DEFAULT_USER.id,
    questionTypeReferenceId: 1,
    content: 'כמה שעות עבדת היום?',
    upperLimit: 10,
    lowerLimit: 1,
    isMandatory: true,
    startDate: getDaysAgo(30),
    endDate: getDaysAgo(-30),
    effectiveDate: today,
    ...overrides,
  };
};

let teacherQuestionIdCounter = 1;
const createTeacherQuestion = (questionId = 1, teacherId = 1) => ({
  id: teacherQuestionIdCounter++,
  userId: 1,
  questionReferenceId: questionId,
  teacherReferenceId: teacherId,
});

// ============================================================================
// Common Scenario Helpers
// ============================================================================

const createBaseScenario = (name: string, teacherTypeKey: TeacherTypeId) => {
  const today = getToday();
  return scenario(name)
    .withUser(DEFAULT_USER)
    .withTeacher(createTeacher(teacherTypeKey))
    .withWorkingDates([today])
    .withStandardTexts(teacherTypeKey);
};

describe('YemotHandlerService - Complete Flow Tests', () => {
  describe('SEMINAR_KITA Teacher Flows', () => {
    it('should complete full report flow with valid data', async () => {
      const today = getToday();

      const testScenario = createBaseScenario('SEMINAR_KITA - Complete valid report', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
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

    it('should complete flow with multiple date reporting', async () => {
      const today = getToday();
      const yesterday = getYesterday();

      const testScenario = createBaseScenario('SEMINAR_KITA - Multiple date reporting', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withWorkingDates([yesterday, today])
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        // First date - yesterday
        .dateSelectionFlow(yesterday, true)
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true,
          discuss: 1,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm first report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '1', 'Report another date')
        // Second date - today (goes directly to date selection, no main menu)
        .dateSelectionFlow(today, true)
        .seminarKitaDataFlow({
          lessons: 8,
          watch: 3,
          teach: 3,
          kamal: false,
          discuss: 2,
          absence: 0,
        })
        .systemAsks({ contains: 'לאישור' }, '1', 'Confirm second report')
        .systemSends(undefined, 'Success message')
        .systemAsks({ contains: 'יום נוסף' }, '2', 'No more reports')
        .systemHangsUp(undefined, 'Goodbye')
        // Validator checks first report - so expect yesterday's data
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

      // Run scenario and validate both reports were saved
      const context = await runScenario(testScenario);
      expect(context.setup.savedAttReports).toHaveLength(2);
      // Validate second report data
      expect(context.setup.savedAttReports[1]).toMatchObject({
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
      });
    });

    it('should reject and retry when lesson count does not match formula', async () => {
      const today = getToday();

      const testScenario = createBaseScenario('SEMINAR_KITA - Lesson count validation', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        // First attempt - invalid: lessons=6 but watch+teach+kamal+discuss+absence=5
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 1,
          kamal: false, // 0
          discuss: 1,
          absence: 1,
          // Total: 2+1+0+1+1 = 5, but lessons=6 (mismatch!)
        })
        .systemSends({ contains: 'לא תואם' }, 'Lesson count mismatch error')
        // Second attempt - valid: lessons=6 and watch+teach+kamal+discuss+absence=6
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 2,
          kamal: true, // 1
          discuss: 1,
          absence: 0,
          // Total: 2+2+1+1+0 = 6, matches lessons=6 ✓
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

    it.todo('should reject and retry when absences exceed 10 total');

    it('should reject when trying to report absences that would exceed 10 total', async () => {
      const today = getToday();

      // Create existing reports with 7 absences total
      const existingReports = [
        {
          id: 100,
          userId: 1,
          teacherReferenceId: 1,
          reportDate: getDaysAgo(2),
          howManyLessonsAbsence: 4,
          isConfirmed: true,
        },
        {
          id: 101,
          userId: 1,
          teacherReferenceId: 1,
          reportDate: getDaysAgo(1),
          howManyLessonsAbsence: 3,
          isConfirmed: true,
        },
      ];

      const testScenario = createBaseScenario('SEMINAR_KITA - Absences validation', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withExistingReports(existingReports)
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        // Attempt to report 4 absences - would make total 7+4=11 (exceeds 10!)
        .seminarKitaDataFlow({
          lessons: 6,
          watch: 2,
          teach: 0,
          kamal: false,
          discuss: 0,
          absence: 4, // This would exceed limit!
        })
        .systemSends({ contains: 'יותר מ-10 חיסורים' }, 'Too many absences error')
        // The system will ask for data collection again, but we stop testing here
        // to verify that the validation error was properly shown
        .expectCallEnded(false) // Test partial flow - validation error was triggered
        .build();

      await runScenario(testScenario);
    });
  });

  describe('MANHA Teacher Flows', () => {
    it('should complete MANHA Type 1: Self-report with methodic lessons', async () => {
      const today = getToday();

      const testScenario = createBaseScenario('MANHA Type 1 - Self-report', TeacherTypeId.MANHA)
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
      const today = getToday();

      const testScenario = createBaseScenario('PDS - Complete valid report', TeacherTypeId.PDS)
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
      const today = getToday();

      const testScenario = createBaseScenario('KINDERGARTEN - Collective watch', TeacherTypeId.KINDERGARTEN)
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
      const today = getToday();

      const testScenario = createBaseScenario('KINDERGARTEN - Individual watch', TeacherTypeId.KINDERGARTEN)
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
      const today = getToday();
      const tomorrow = getTomorrow();

      const tomorrowStr = formatDateForInput(tomorrow);
      const todayStr = formatDateForInput(today);

      const testScenario = createBaseScenario('Date validation - Future date rejected', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
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
      const today = getToday();
      const yesterday = getYesterday();

      const yesterdayStr = formatDateForInput(yesterday);
      const todayStr = formatDateForInput(today);

      const testScenario = createBaseScenario('Date validation - Non-working date rejected', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
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
      const today = getToday();
      const todayStr = formatDateForInput(today);

      const testScenario = createBaseScenario('Date validation - User rejects confirmation', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
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
      const today = getToday();
      const invalidDateStr = '99999999'; // Invalid date: 99th day of 99th month
      const todayStr = formatDateForInput(today);

      const testScenario = createBaseScenario('Date validation - Invalid format rejected', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
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

    it('should reject date with existing confirmed report', async () => {
      const today = getToday();
      const yesterday = getYesterday();

      // Create an existing confirmed report for today
      const existingReports = [
        {
          id: 100,
          userId: 1,
          teacherReferenceId: 1,
          reportDate: today,
          howManyLessons: 4,
          isConfirmed: true,
        },
      ];

      const todayStr = formatDateForInput(today);
      const yesterdayStr = formatDateForInput(yesterday);

      const testScenario = createBaseScenario('Date validation - Existing confirmed report', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withWorkingDates([yesterday, today])
        .withExistingReports(existingReports)
        .addText('VALIDATION.REPORT_ALREADY_EXISTS', 'קיים כבר דיווח לתאריך זה')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .systemAsks({ contains: 'תאריך' }, todayStr, 'Enter date with existing report')
        .systemSends({ contains: 'קיים כבר דיווח' }, 'Report already exists error')
        .systemAsks({ contains: 'תאריך' }, yesterdayStr, 'Enter different date')
        .expectCallEnded(false) // Test partial - validate error message shown
        .build();

      await runScenario(testScenario);
    });
  });

  describe('Report Confirmation & Retry', () => {
    it('should allow teacher to reject confirmation and restart data collection', async () => {
      const today = getToday();

      const testScenario = createBaseScenario('Report confirmation - Reject and retry', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
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
      const today = getToday();

      const testScenario = createBaseScenario('PDS - Reject confirmation and retry', TeacherTypeId.PDS)
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
    it('should ask mandatory question and save answer', async () => {
      const today = getToday();

      const questions = [createQuestion()];
      const teacherQuestions = [createTeacherQuestion()];

      const testScenario = createBaseScenario('Questions - Mandatory question with answer', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withQuestions(questions)
        .withTeacherQuestions(teacherQuestions)
        .addText('QUESTION.CHOOSE_ANSWER', 'נא להקיש את התשובה')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'כמה שעות עבדת היום' }, '8', 'Answer mandatory question')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .expectSavedAnswers([
          {
            userId: 1,
            teacherTz: '123456789',
            questionReferenceId: 1,
            answer: 8,
          },
        ])
        .expectCallEnded(false) // Partial flow - testing question was asked and saved
        .build();

      await runScenario(testScenario);
    });

    it('should prevent skipping mandatory question with * key', async () => {
      const today = getToday();

      const questions = [createQuestion()];
      const teacherQuestions = [createTeacherQuestion()];

      const testScenario = createBaseScenario('Questions - Cannot skip mandatory', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withQuestions(questions)
        .withTeacherQuestions(teacherQuestions)
        .addText('QUESTION.CHOOSE_ANSWER', 'נא להקיש את התשובה')
        .addText('QUESTION.CANNOT_SKIP_MANDATORY', 'לא ניתן לדלג על שאלה זו')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'כמה שעות עבדת היום' }, '*', 'Try to skip with *')
        .systemSends({ contains: 'לא ניתן לדלג' }, 'Cannot skip mandatory error')
        .systemAsks({ contains: 'כמה שעות עבדת היום' }, '7', 'Answer mandatory question')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        // Answer should be saved after successful input
        .expectSavedAnswers([
          {
            userId: 1,
            teacherTz: '123456789',
            questionReferenceId: 1,
            answer: 7,
          },
        ])
        .expectCallEnded(false) // Partial flow test
        .build();

      await runScenario(testScenario);
    });

    it('should allow skipping optional question with * key', async () => {
      const today = getToday();

      const questions = [
        createQuestion({
          content: 'האם היו בעיות טכניות?',
          upperLimit: 1,
          lowerLimit: 0,
          isMandatory: false, // Optional question
        }),
      ];
      const teacherQuestions = [createTeacherQuestion()];

      const testScenario = createBaseScenario('Questions - Skip optional question', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withQuestions(questions)
        .withTeacherQuestions(teacherQuestions)
        .addText('QUESTION.CHOOSE_ANSWER', 'נא להקיש את התשובה')
        .addText('QUESTION.SKIP_INSTRUCTION', 'לדלג על השאלה לחצי כוכבית')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'האם היו בעיות טכניות' }, '*', 'Skip optional question')
        // Verify * was accepted (no error, no re-ask) - system proceeds directly to main menu
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: proves * skip was valid')
        // Question was skipped, no answer should be saved
        .expectCallEnded(false) // Partial flow test
        .build();

      await runScenario(testScenario);
    });

    it('should validate answer within range (lowerLimit/upperLimit)', async () => {
      const today = getToday();

      const questions = [
        createQuestion({
          content: 'דרג את השיעור מ-1 עד 5',
          upperLimit: 5,
          lowerLimit: 1,
        }),
      ];
      const teacherQuestions = [createTeacherQuestion()];

      const testScenario = createBaseScenario('Questions - Validate answer range', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withQuestions(questions)
        .withTeacherQuestions(teacherQuestions)
        .addText('QUESTION.CHOOSE_ANSWER', 'נא להקיש את התשובה')
        .addText('QUESTION.ANSWER_OUT_OF_RANGE', 'התשובה צריכה להיות בין {min} ל-{max}')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'דרג את השיעור' }, '8', 'Answer above upper limit (5)')
        .systemSends({ contains: 'בין' }, 'Out of range error')
        .systemAsks({ contains: 'דרג את השיעור' }, '4', 'Valid answer within range')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        // Valid answer should be saved
        .expectSavedAnswers([
          {
            userId: 1,
            teacherTz: '123456789',
            questionReferenceId: 1,
            answer: 4,
          },
        ])
        .expectCallEnded(false) // Partial flow test
        .build();

      await runScenario(testScenario);
    });

    it('should process multiple questions in sequence', async () => {
      const today = getToday();

      const questions = [
        createQuestion({
          id: 1,
          content: 'כמה שעות עבדת היום?',
          upperLimit: 10,
          lowerLimit: 1,
          isMandatory: true,
        }),
        createQuestion({
          id: 2,
          content: 'האם השיעור היה טוב?',
          upperLimit: 1,
          lowerLimit: 0,
          isMandatory: false,
        }),
        createQuestion({
          id: 3,
          content: 'דרג את השיעור מ-1 עד 5',
          upperLimit: 5,
          lowerLimit: 1,
          isMandatory: true,
        }),
      ];

      const teacherQuestions = [createTeacherQuestion(1), createTeacherQuestion(2), createTeacherQuestion(3)];

      const testScenario = createBaseScenario('Questions - Multiple in sequence', TeacherTypeId.SEMINAR_KITA)
        .withStudents(5)
        .withQuestions(questions)
        .withTeacherQuestions(teacherQuestions)
        .addText('QUESTION.CHOOSE_ANSWER', 'נא להקיש את התשובה')
        .addText('QUESTION.SKIP_INSTRUCTION', 'לדלג על השאלה לחצי כוכבית')
        .systemSends(undefined, 'Welcome message')
        // Question 1 - mandatory
        .systemAsks({ contains: 'כמה שעות עבדת היום' }, '7', 'Answer question 1')
        // Question 2 - optional, skip it
        .systemAsks({ contains: 'האם השיעור היה טוב' }, '*', 'Skip question 2')
        // Question 3 - mandatory
        .systemAsks({ contains: 'דרג את השיעור' }, '4', 'Answer question 3')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .expectSavedAnswers([
          {
            userId: 1,
            teacherTz: '123456789',
            questionReferenceId: 1,
            answer: 7,
          },
          {
            userId: 1,
            teacherTz: '123456789',
            questionReferenceId: 3,
            answer: 4,
          },
        ])
        .expectCallEnded(false) // Partial flow test
        .build();

      const context = await runScenario(testScenario);
      // Verify exactly 2 answers saved (question 2 was skipped)
      expect(context.setup.savedAnswers).toHaveLength(2);
    });
  });

  describe('Teacher & Student Lookup', () => {
    it('should find teacher by 4 last digits - single match', async () => {
      const today = getToday();

      const otherTeachers = [
        {
          id: 10,
          userId: 1,
          name: 'מורה אחרת',
          phone: '0527609999', // Last 4 digits: 9999
          teacherTypeReferenceId: 1,
        },
      ];

      const testScenario = createBaseScenario('MANHA - Teacher lookup single match', TeacherTypeId.MANHA)
        .withOtherTeachers(otherTeachers)
        .addText('REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE', 'הקישי 4 ספרות אחרונות')
        .addText('TEACHER.CONFIRM_TEACHER_SINGLE', 'האם המורה היא {teacherName}?')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .systemAsks({ contains: 'עצמך או על מורות אחרות' }, '2', 'Report type: others (2)')
        .systemAsks({ contains: '4 ספרות אחרונות' }, '9999', 'Enter 4 last digits')
        .systemAsks({ contains: 'מורה אחרת' }, '1', 'Confirm teacher')
        // Now continue with data collection for this teacher...
        .expectCallEnded(false) // Partial flow test
        .build();

      await runScenario(testScenario);
    });

    it('should find teacher by 4 last digits - multiple matches with selection', async () => {
      const today = getToday();

      const otherTeachers = [
        {
          id: 10,
          userId: 1,
          name: 'מורה ראשונה',
          phone: '0527609999', // Last 4 digits: 9999
          teacherTypeReferenceId: 1,
        },
        {
          id: 11,
          userId: 1,
          name: 'מורה שנייה',
          phone: '0537779999', // Last 4 digits: 9999
          teacherTypeReferenceId: 1,
        },
      ];

      const testScenario = createBaseScenario('MANHA - Teacher lookup multiple matches', TeacherTypeId.MANHA)
        .withOtherTeachers(otherTeachers)
        .addText('REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE', 'הקישי 4 ספרות אחרונות')
        .addText('TEACHER.CONFIRM_TEACHER_MULTI', 'בחרי מורה: {teacherList}')
        .addText('TEACHER.CONFIRM_TEACHER_SINGLE', 'האם המורה היא {teacherName}?')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .systemAsks({ contains: 'עצמך או על מורות אחרות' }, '2', 'Report type: others (2)')
        .systemAsks({ contains: '4 ספרות אחרונות' }, '9999', 'Enter 4 last digits')
        .systemAsks({ contains: 'בחרי מורה' }, '2', 'Select second teacher')
        .systemAsks({ contains: 'מורה שנייה' }, '1', 'Confirm teacher')
        // Now continue with data collection for this teacher...
        .expectCallEnded(false) // Partial flow test
        .build();

      await runScenario(testScenario);
    });

    it('should handle no teacher found by 4 last digits', async () => {
      const today = getToday();

      const otherTeachers = [
        {
          id: 10,
          userId: 1,
          name: 'מורה אחרת',
          phone: '0527609999', // Last 4 digits: 9999
          teacherTypeReferenceId: 1,
        },
      ];

      const testScenario = createBaseScenario('MANHA - Teacher not found', TeacherTypeId.MANHA)
        .withOtherTeachers(otherTeachers)
        .addText('REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE', 'הקישי 4 ספרות אחרונות')
        .addText('TEACHER.NO_TEACHER_FOUND_BY_DIGITS', 'לא נמצאה מורה עם ספרות אלו')
        .addText('TEACHER.CONFIRM_TEACHER_SINGLE', 'האם המורה היא {teacherName}?')
        .systemSends(undefined, 'Welcome message')
        .systemAsks({ contains: 'לתיקוף נוכחות' }, '1', 'Main menu: new report')
        .dateSelectionFlow(today, true)
        .systemAsks({ contains: 'עצמך או על מורות אחרות' }, '2', 'Report type: others (2)')
        .systemAsks({ contains: '4 ספרות אחרונות' }, '1234', 'Enter non-existent digits')
        .systemSends({ contains: 'לא נמצאה' }, 'Teacher not found error')
        .systemAsks({ contains: '4 ספרות אחרונות' }, '9999', 'Enter correct digits')
        .systemAsks({ contains: 'מורה אחרת' }, '1', 'Confirm teacher')
        // Now continue with data collection for this teacher...
        .expectCallEnded(false) // Partial flow test
        .build();

      await runScenario(testScenario);
    });

    it.todo('should collect student TZ with confirmation');
    it.todo('should handle student not found and retry');
    it.todo('should collect multiple student TZs in loop');
  });
});
