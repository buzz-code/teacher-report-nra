import { YemotScenarioBuilder, YemotScenarioRunner, useFakeDateOnly } from '@shared/utils/yemot/testing';
import { YemotHandlerService } from './yemot-handler.service';

describe('YemotHandlerService — teacher-report-nra', () => {
  const runner = new YemotScenarioRunner(YemotHandlerService as any);

  beforeEach(() => useFakeDateOnly());
  afterEach(() => jest.useRealTimers());

  const baseUser = {
    id: 1,
    phoneNumber: '099999999',
    name: 'Test User',
    effective_id: null,
  };

  const baseTexts = [
    { userId: 0, name: 'TEACHER.WELCOME', description: '', value: 'Welcome {teacherTypeName} {name}' },
    { userId: 0, name: 'TEACHER.PHONE_NOT_RECOGNIZED', description: '', value: 'Phone not recognized' },
    { userId: 0, name: 'TEACHER.TYPE_NOT_RECOGNIZED', description: '', value: 'Teacher type not recognized' },
    { userId: 0, name: 'REPORT.MAIN_MENU', description: '', value: 'Press 1 for new report, 3 for previous reports' },
    { userId: 0, name: 'REPORT.CHOOSE_DATE', description: '', value: 'Enter date DDMMYYYY' },
    { userId: 0, name: 'REPORT.CONFIRM_DATE', description: '', value: 'Confirm date: {date}?' },
    { userId: 0, name: 'REPORT.DATA_NOT_SAVED', description: '', value: 'Data not saved' },
    { userId: 0, name: 'REPORT.SUCCESS', description: '', value: 'Report saved successfully' },
    { userId: 0, name: 'REPORT.VALIDATION_CONFIRM_SEMINAR_KITA', description: '', value: 'Confirm report' },
    { userId: 0, name: 'REPORT.VALIDATION_CONFIRM_MANHA', description: '', value: 'Confirm report' },
    { userId: 0, name: 'REPORT.VALIDATION_CONFIRM_PDS', description: '', value: 'Confirm report' },
    { userId: 0, name: 'REPORT.VALIDATION_CONFIRM_KINDERGARTEN', description: '', value: 'Confirm report' },
    { userId: 0, name: 'REPORT.VALIDATION_CONFIRM_SPECIAL_EDUCATION', description: '', value: 'Confirm report' },
    { userId: 0, name: 'REPORT.HOW_MANY_STUDENTS_SEMINAR_KITA', description: '', value: 'How many students?' },
    { userId: 0, name: 'REPORT.HOW_MANY_LESSONS_SEMINAR_KITA', description: '', value: 'How many lessons?' },
    { userId: 0, name: 'REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL', description: '', value: 'How many watch or individual?' },
    { userId: 0, name: 'REPORT.HOW_MANY_TEACHED_OR_INTERFERING', description: '', value: 'How many teached or interfering?' },
    { userId: 0, name: 'REPORT.HOW_MANY_DISCUSSING_LESSONS', description: '', value: 'How many discussing lessons?' },
    { userId: 0, name: 'REPORT.WAS_KAMAL', description: '', value: 'Was kamal?' },
    { userId: 0, name: 'REPORT.HOW_MANY_LESSONS_ABSENCE', description: '', value: 'How many lessons absence?' },
    { userId: 0, name: 'VALIDATION.INVALID_DATE', description: '', value: 'Invalid date' },
    { userId: 0, name: 'VALIDATION.CANNOT_REPORT_FUTURE', description: '', value: 'Cannot report future' },
    { userId: 0, name: 'VALIDATION.CANNOT_REPORT_NON_WORKING_DAY', description: '', value: 'Cannot report non working day' },
    { userId: 0, name: 'VALIDATION.EXISTING_REPORT_WILL_BE_DELETED', description: '', value: 'Existing report will be deleted' },
    { userId: 0, name: 'VALIDATION.CANNOT_REPORT_SALARY_REPORT', description: '', value: 'Cannot report salary report' },
    { userId: 0, name: 'VALIDATION.OUT_OF_RANGE', description: '', value: 'Out of range' },
    { userId: 0, name: 'QUESTION.SKIP_INSTRUCTION', description: '', value: 'Press * to skip' },
    { userId: 0, name: 'QUESTION.CANNOT_SKIP_MANDATORY', description: '', value: 'Cannot skip mandatory' },
    { userId: 0, name: 'QUESTION.ANSWER_ECHO', description: '', value: 'Question: {questionText}, Answer: {answer}' },
    { userId: 0, name: 'GENERAL.YES', description: '', value: 'Yes' },
    { userId: 0, name: 'GENERAL.NO', description: '', value: 'No' },
    { userId: 0, name: 'REPORT.CHOOSE_REPORTS_MONTH', description: '', value: 'Enter month number' },
    { userId: 0, name: 'REPORT.NO_REPORT_FOUND', description: '', value: 'No reports found' },
    { userId: 0, name: 'REPORT.GOODBYE_TO_MANHA_TEACHER', description: '', value: 'Goodbye' },
    { userId: 0, name: 'REPORT.DATA_SAVED_SUCCESS', description: '', value: 'Report saved' },
    { userId: 0, name: 'REPORT.ANOTHER_DATE_REPORT', description: '', value: 'Another date?' },
    { userId: 0, name: 'REPORT.ANOTHER_TEACHER_REPORT', description: '', value: 'Another teacher?' },
  ];

  const baseTeacherType = { id: 1, userId: 1, key: 1, name: 'Seminar Kita' };

  const baseTeacher = {
    id: 1,
    userId: 1,
    name: 'Test Teacher',
    phone: '0501234567',
    tz: '123456789',
    teacherTypeReferenceId: 1,
  };

  // ---- Maintenance ----

  it('maintenance message — immediate hangup', async () => {
    const scenario = new YemotScenarioBuilder('Maintenance message')
      .seed('User', [{ ...baseUser, additionalData: { maintainanceMessage: 'System under maintenance' } }])
      .seed('Text', baseTexts)
      .systemHangsUp('System under maintenance')
      .build();

    const result = await runner.run(scenario);
    expect(result.passed).toBe(true);
    expect(result.hungup).toBe(true);
  });

  // ---- Teacher not found ----

  it('teacher not found by phone — hangup', async () => {
    const scenario = new YemotScenarioBuilder('Teacher not found')
      .seed('User', [baseUser])
      .seed('Text', baseTexts)
      .systemHangsUp('Phone not recognized')
      .build();

    const result = await runner.run(scenario);
    expect(result.passed).toBe(true);
    expect(result.hungup).toBe(true);
  });

  // ---- Welcome message ----

  it('welcome message — correct teacher type name in welcome', async () => {
    const scenario = new YemotScenarioBuilder('Welcome message')
      .seed('User', [baseUser])
      .seed('TeacherType', [baseTeacherType])
      .seed('Teacher', [baseTeacher])
      .seed('Text', baseTexts)
      .systemSends('Welcome Seminar Kita Test Teacher')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('9')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('9')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('9')
      .build();

    const result = await runner.run(scenario);
    // Handler loops on invalid input — runs out of inputs
    expect(result.passed).toBe(false);
    expect(result.failureMessage).toMatch(/ran out of programmed inputs|no more call actions/i);
  });

  // ---- Show reports: no reports found ----

  it('show reports (3) — no reports found for month, hangup', async () => {
    const scenario = new YemotScenarioBuilder('Show reports - none found')
      .seed('User', [baseUser])
      .seed('TeacherType', [baseTeacherType])
      .seed('Teacher', [baseTeacher])
      .seed('Text', baseTexts)
      .systemSends('Welcome Seminar Kita Test Teacher')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('3')
      .systemAsks('Enter month number')
      .userResponds('1')
      .systemHangsUp('No reports found')
      .build();

    const result = await runner.run(scenario);
    expect(result.passed).toBe(true);
    expect(result.hungup).toBe(true);
  });

  // ---- New report: invalid date (future) ----

  it('new report (1) — future date rejected, retry', async () => {
    const scenario = new YemotScenarioBuilder('Future date rejected')
      .seed('User', [baseUser])
      .seed('TeacherType', [baseTeacherType])
      .seed('Teacher', [baseTeacher])
      .seed('Text', baseTexts)
      .systemSends('Welcome Seminar Kita Test Teacher')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('1')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds('01012099')
      .systemSends('Cannot report future')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds('01012099')
      .systemSends('Cannot report future')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds('01012099')
      .build();

    const result = await runner.run(scenario);
    // Runs out of inputs after 3 retries
    expect(result.passed).toBe(false);
    expect(result.failureMessage).toMatch(/ran out of programmed inputs|no more call actions/i);
  });

  // ---- New report: non-working day ----

  it('new report (1) — non-working day rejected', async () => {
    // Use a past date that is NOT in working_dates
    const pastDate = '01012020'; // 01/01/2020

    const scenario = new YemotScenarioBuilder('Non-working day rejected')
      .seed('User', [baseUser])
      .seed('TeacherType', [baseTeacherType])
      .seed('Teacher', [baseTeacher])
      .seed('Text', baseTexts)
      .systemSends('Welcome Seminar Kita Test Teacher')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('1')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds(pastDate)
      .systemSends('Cannot report non working day')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds(pastDate)
      .systemSends('Cannot report non working day')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds(pastDate)
      .build();

    const result = await runner.run(scenario);
    expect(result.passed).toBe(false);
    expect(result.failureMessage).toMatch(/ran out of programmed inputs|no more call actions/i);
  });

  // ---- New report: working day, date confirmation rejected (loops back) ----

  it('new report (1) — working day, date not confirmed, loops back', async () => {
    // Seed a working date for 01/01/2020
    const workingDate = new Date('2020-01-01');

    const scenario = new YemotScenarioBuilder('Date not confirmed')
      .seed('User', [baseUser])
      .seed('TeacherType', [baseTeacherType])
      .seed('Teacher', [baseTeacher])
      .seed('WorkingDate', [{ id: 1, userId: 1, teacherTypeReferenceId: 1, workingDate }])
      .seed('Text', baseTexts)
      .systemSends('Welcome Seminar Kita Test Teacher')
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('1')
      .systemAsks('Enter date DDMMYYYY')
      .userResponds('01012020')
      .systemAsksConfirmation('Confirm date: ')
      .userConfirms(false)
      .systemAsks('Enter date DDMMYYYY')
      .userResponds('01012020')
      .systemAsksConfirmation('Confirm date: ')
      .userConfirms(false)
      .systemAsks('Enter date DDMMYYYY')
      .userResponds('01012020')
      .build();

    const result = await runner.run(scenario);
    // After 2 rejections, the 3rd attempt runs out of inputs at the confirmation step
    expect(result.passed).toBe(false);
    expect(result.failureMessage).toMatch(/ran out of programmed inputs|no more call actions/i);
  });

  // ---- Stub tests for uncovered branches ----

  it.skip('welcome — teacher type not found, uses default name', () => { });
  it.skip('welcome — no teacher type reference, uses default name', () => { });
  it.skip('questions — pre-answered, skip question loop', () => { });
  it.skip('questions — skip mandatory with star, error then valid answer', () => { });
  it.skip('questions — skip optional with star, move to next', () => { });
  it.skip('questions — answer out of range, retry with valid answer', () => { });
  it.skip('questions — non-numeric answer, retry with valid answer', () => { });
  it.skip('questions — valid answer, save and echo back', () => { });
  it.skip('report date — already set, skip menu', () => { });
  it.skip('new report — invalid date format, retry', () => { });
  it.skip('new report — existing salary report, cannot report', () => { });
  it.skip('new report — existing report will be deleted message', () => { });
  it.skip('new report — working day, date confirmed, proceed to report', () => { });
  it.skip('seminar kita report — full flow with all inputs', () => { });
  it.skip('training report — throws not implemented error', () => { });
  it.skip('manha report — full flow with methodic and discussing', () => { });
  it.skip('responsible report — throws not implemented error', () => { });
  it.skip('pds report — full flow with watch, teached, discussing', () => { });
  it.skip('kindergarten report — collective watch = 1, skip students', () => { });
  it.skip('kindergarten report — no collective watch, ask students and behavior', () => { });
  it.skip('special education report — full flow with all inputs', () => { });
  it.skip('unknown teacher type — hangup with TYPE_NOT_RECOGNIZED', () => { });
  it.skip('seminar kita — current student count available, skip asking', () => { });
  it.skip('seminar kita — no current student count, ask for input', () => { });
  it.skip('confirmation — no config for teacher type, skip', () => { });
  it.skip('seminar kita — more than 10 absences, validation error and retry', () => { });
  it.skip('seminar kita — lesson count mismatch, validation error and retry', () => { });
  it.skip('confirmation — rejected, reset and re-collect report data', () => { });
  it.skip('confirmation — accepted, proceed to save report', () => { });
  it.skip('report saved — finishSavingReport called', () => { });
  it.skip('report save error — hangup with DATA_NOT_SAVED', () => { });
  it.skip('finish — manha another teacher yes, re-collect', () => { });
  it.skip('finish — manha another teacher no, hangup', () => { });
  it.skip('finish — seminar kita another date yes, reset and re-collect', () => { });
  it.skip('finish — seminar kita another date no, hangup', () => { });
  it.skip('finish — other teacher type, hangup with DATA_SAVED_SUCCESS', () => { });
  it.skip('show reports — reports found, read all and hangup', () => { });
  it.skip('teacher four digits — no teacher found, retry', () => { });
  it.skip('teacher four digits — multiple teachers, select 0 to retry', () => { });
  it.skip('teacher four digits — multiple teachers, invalid selection, retry', () => { });
  it.skip('teacher four digits — multiple teachers, valid selection', () => { });
  it.skip('teacher four digits — single teacher, not confirmed, retry', () => { });
  it.skip('teacher four digits — single teacher, confirmed', () => { });
  it.skip('teached student TZ — not found, retry', () => { });
  it.skip('teached student TZ — not confirmed, retry', () => { });
  it.skip('teached student TZ — confirmed, add to collection', () => { });
  it.skip('report message — formatted message for teacher type', () => { });
  it.skip('report message — no key for teacher type, return default', () => { });
  it.skip('estimated price — no teacher type key, return 0', () => { });
  it.skip('estimated price — calculate price for seminar kita report', () => { });
  it.skip('current student count — no teacher, return 0', () => { });
  it.skip('current student count — with teacher, return count', () => { });
});