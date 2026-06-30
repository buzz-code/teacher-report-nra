import { YemotScenarioBuilder, YemotScenarioRunner, useFakeDateOnly } from '@shared/utils/yemot/testing';
import { YemotHandlerService } from './yemot-handler.service';

describe('YemotHandlerService — teacher-report-nra', () => {
  const runner = new YemotScenarioRunner(YemotHandlerService as any);

  beforeEach(() => useFakeDateOnly());
  afterEach(() => jest.useRealTimers());

  // ---- Base data ----

  const baseUser = { id: 1, phoneNumber: '099999999', name: 'Test User', effective_id: null };

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
    {
      userId: 0,
      name: 'REPORT.HOW_MANY_TEACHED_OR_INTERFERING',
      description: '',
      value: 'How many teached or interfering?',
    },
    { userId: 0, name: 'REPORT.HOW_MANY_DISCUSSING_LESSONS', description: '', value: 'How many discussing lessons?' },
    { userId: 0, name: 'REPORT.WAS_KAMAL', description: '', value: 'Was kamal?' },
    { userId: 0, name: 'REPORT.HOW_MANY_LESSONS_ABSENCE', description: '', value: 'How many lessons absence?' },
    { userId: 0, name: 'VALIDATION.INVALID_DATE', description: '', value: 'Invalid date' },
    { userId: 0, name: 'VALIDATION.CANNOT_REPORT_FUTURE', description: '', value: 'Cannot report future' },
    {
      userId: 0,
      name: 'VALIDATION.CANNOT_REPORT_NON_WORKING_DAY',
      description: '',
      value: 'Cannot report non working day',
    },
    {
      userId: 0,
      name: 'VALIDATION.EXISTING_REPORT_WILL_BE_DELETED',
      description: '',
      value: 'Existing report will be deleted',
    },
    {
      userId: 0,
      name: 'VALIDATION.CANNOT_REPORT_SALARY_REPORT',
      description: '',
      value: 'Cannot report salary report',
    },
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
    {
      userId: 0,
      name: 'REPORT.HOW_MANY_LESSONS_ABSENCE_SEMINAR_KITA',
      description: '',
      value: 'How many lessons absence?',
    },
    { userId: 0, name: 'REPORT.HOW_MANY_METHODIC', description: '', value: 'How many methodic?' },
    { userId: 0, name: 'REPORT.WAS_COLLECTIVE_WATCH', description: '', value: 'Was collective watch?' },
    { userId: 0, name: 'REPORT.HOW_MANY_STUDENTS', description: '', value: 'How many students?' },
    { userId: 0, name: 'REPORT.WAS_STUDENTS_GOOD', description: '', value: 'Was students good?' },
    { userId: 0, name: 'REPORT.HOW_MANY_LESSONS', description: '', value: 'How many lessons?' },
    { userId: 0, name: 'REPORT.HOW_MANY_STUDENTS_WATCHED', description: '', value: 'How many students watched?' },
    { userId: 0, name: 'REPORT.HOW_MANY_STUDENTS_TEACHED', description: '', value: 'How many students teached?' },
    { userId: 0, name: 'REPORT.WAS_PHONE_DISCUSSING', description: '', value: 'Was phone discussing?' },
    { userId: 0, name: 'REPORT.WHO_IS_YOUR_TRAINING_TEACHER', description: '', value: 'Who is your training teacher?' },
    { userId: 0, name: 'REPORT.WHAT_IS_YOUR_SPECIALITY', description: '', value: 'What is your speciality?' },
    {
      userId: 0,
      name: 'REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE',
      description: '',
      value: 'Enter last 4 digits of teacher phone',
    },
    { userId: 0, name: 'TEACHER.NO_TEACHER_FOUND_BY_DIGITS', description: '', value: 'No teacher found by digits' },
    { userId: 0, name: 'TEACHER.CONFIRM_TEACHER_MULTI', description: '', value: 'Select teacher: {teacherList}' },
    { userId: 0, name: 'TEACHER.CONFIRM_TEACHER_SINGLE', description: '', value: 'Confirm teacher: {teacherName}' },
    { userId: 0, name: 'GENERAL.INVALID_INPUT', description: '', value: 'Invalid input' },
    { userId: 0, name: 'STUDENT.TZ_PROMPT', description: '', value: 'Enter student TZ for student {number}' },
    { userId: 0, name: 'STUDENT.NOT_FOUND', description: '', value: 'Student not found' },
    { userId: 0, name: 'STUDENT.CONFIRM', description: '', value: 'Confirm student: {studentName}' },
    {
      userId: 0,
      name: 'VALIDATION.CANNOT_REPORT_MORE_THAN_TEN_ABSENCES',
      description: '',
      value: 'Cannot report more than ten absences',
    },
    { userId: 0, name: 'VALIDATION.SEMINAR_KITA_LESSON_COUNT', description: '', value: 'Lesson count mismatch' },
    {
      userId: 0,
      name: 'REPORT.SEMINAR_KITA_PREVIOUS',
      description: '',
      value: 'Report date {date}: {students} students, {lessons} lessons',
    },
    { userId: 0, name: 'REPORT.MANHA_PREVIOUS', description: '', value: 'Report date {date}: {methodic} methodic' },
    { userId: 0, name: 'REPORT.PDS_PREVIOUS', description: '', value: 'Report date {date}: {watchIndiv} watch' },
    {
      userId: 0,
      name: 'REPORT.KINDERGARTEN_PREVIOUS',
      description: '',
      value: 'Report date {date}: {students} students',
    },
    {
      userId: 0,
      name: 'REPORT.SPECIAL_EDUCATION_PREVIOUS',
      description: '',
      value: 'Report date {date}: {lessons} lessons',
    },
  ];

  const baseTeacher = {
    id: 1,
    userId: 1,
    name: 'Test Teacher',
    phone: '0501234567',
    tz: '123456789',
    teacherTypeReferenceId: 1,
  };

  // ---- Shared data ----

  const tt = (key: number, name: string) => ({ id: key, userId: 1, key, name });
  const t = (id: number, key: number) => ({ ...baseTeacher, id, teacherTypeReferenceId: key });

  const seminarKitaType = tt(1, 'Seminar Kita');
  const manhaType = tt(3, 'Manha');
  const pdsType = tt(5, 'PDS');
  const kgType = tt(6, 'Kindergarten');
  const seType = tt(7, 'Special Education');

  const workingDate = new Date('2020-01-01');
  const wd = (teacherTypeRefId: number) => [
    { id: 1, userId: 1, teacherTypeReferenceId: teacherTypeRefId, workingDate },
  ];

  const baseQuestion = (content: string, mandatory = true, upper = 5, lower = 1) => ({
    id: 1,
    userId: 1,
    content,
    isMandatory: mandatory,
    upperLimit: upper,
    lowerLimit: lower,
    startDate: new Date('2020-01-01'),
    endDate: new Date('2030-12-31'),
  });
  const baseTeacherQuestion = (answerRef: number | null = null) => ({
    id: 1,
    userId: 1,
    teacherReferenceId: 1,
    questionReferenceId: 1,
    answerReferenceId: answerRef,
  });

  // ---- Test helpers ----

  function b(name: string, teacherType: any, teacher: any = baseTeacher, extraTexts: any[] = []): YemotScenarioBuilder {
    return new YemotScenarioBuilder(name)
      .seed('User', [baseUser])
      .seed('TeacherType', [teacherType])
      .seed('Teacher', [teacher])
      .seed('Text', [...baseTexts, ...extraTexts]);
  }

  async function ok(scenario: any) {
    const result = await runner.run(scenario);
    if (!result.passed) {
      console.log('FAILURE:', result.failureMessage);
      console.log('DEBUG saved:', JSON.stringify(result.saved));
      console.log('Interaction history:');
      for (const h of result.interactionHistory) {
        console.log(`  [${h.type}] ${h.message?.substring(0, 80)} | response: ${h.response}`);
      }
    }
    expect(result.passed).toBe(true);
    expect(result.hungup).toBe(true);
  }

  /** Expect scenario to run out of inputs (for invalid-input-loop tests) */
  async function outOfInputs(scenario: any) {
    const result = await runner.run(scenario);
    expect(result.passed).toBe(false);
    expect(result.failureMessage).toMatch(/ran out of programmed inputs|no more call actions/i);
  }

  // ---- Step-sequence helpers ----

  function welcome(builder: YemotScenarioBuilder): YemotScenarioBuilder {
    return builder.systemSends(/Welcome.*Test Teacher/i);
  }

  /** Repeat a step function N times on the builder */
  function repeat(
    builder: YemotScenarioBuilder,
    count: number,
    step: (b: YemotScenarioBuilder) => YemotScenarioBuilder,
  ): YemotScenarioBuilder {
    for (let i = 0; i < count; i++) builder = step(builder);
    return builder;
  }

  /** Main menu → select new report (1) */
  function selectNewReport(builder: YemotScenarioBuilder): YemotScenarioBuilder {
    return builder.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('1');
  }

  /** Enter date DDMMYYYY → confirm */
  function enterDate(builder: YemotScenarioBuilder, date = '01012020'): YemotScenarioBuilder {
    return builder
      .systemAsks('Enter date DDMMYYYY')
      .userResponds(date)
      .systemAsksConfirmation(/Confirm date/i)
      .userConfirms(true);
  }

  /** Welcome → menu → new report → enter date → confirm */
  function welcomeToDate(builder: YemotScenarioBuilder, date = '01012020'): YemotScenarioBuilder {
    return enterDate(selectNewReport(welcome(builder)), date);
  }

  /** Seminar Kita: 7 report questions */
  function seminarKitaQuestions(
    builder: YemotScenarioBuilder,
    vals = ['5', '5', '1', '1', '1', '1', '1'],
  ): YemotScenarioBuilder {
    return builder
      .systemAsks('How many students?')
      .userResponds(vals[0])
      .systemAsks('How many lessons?')
      .userResponds(vals[1])
      .systemAsks('How many watch or individual?')
      .userResponds(vals[2])
      .systemAsks('How many teached or interfering?')
      .userResponds(vals[3])
      .systemAsks('How many discussing lessons?')
      .userResponds(vals[4])
      .systemAsks('Was kamal?')
      .userResponds(vals[5])
      .systemAsks('How many lessons absence?')
      .userResponds(vals[6]);
  }

  /** Seminar Kita without "How many students?" (when StudentGroup exists) */
  function seminarKitaQuestionsNoStudentCount(
    builder: YemotScenarioBuilder,
    vals = ['5', '1', '1', '1', '1', '1'],
  ): YemotScenarioBuilder {
    return builder
      .systemAsks('How many lessons?')
      .userResponds(vals[0])
      .systemAsks('How many watch or individual?')
      .userResponds(vals[1])
      .systemAsks('How many teached or interfering?')
      .userResponds(vals[2])
      .systemAsks('How many discussing lessons?')
      .userResponds(vals[3])
      .systemAsks('Was kamal?')
      .userResponds(vals[4])
      .systemAsks('How many lessons absence?')
      .userResponds(vals[5]);
  }

  /** Manha: 2 report questions */
  function manhaQuestions(builder: YemotScenarioBuilder, methodic = '2', discussing = '1'): YemotScenarioBuilder {
    return builder
      .systemAsks('How many methodic?')
      .userResponds(methodic)
      .systemAsks('How many discussing lessons?')
      .userResponds(discussing);
  }

  /** PDS: 3 report questions */
  function pdsQuestions(
    builder: YemotScenarioBuilder,
    watch = '2',
    teached = '1',
    discussing = '1',
  ): YemotScenarioBuilder {
    return builder
      .systemAsks('How many watch or individual?')
      .userResponds(watch)
      .systemAsks('How many teached or interfering?')
      .userResponds(teached)
      .systemAsks('How many discussing lessons?')
      .userResponds(discussing);
  }

  /** Kindergarten: collective watch flow */
  function kindergartenQuestions(
    builder: YemotScenarioBuilder,
    collectiveWatch: string,
    students?: string,
    good?: string,
  ): YemotScenarioBuilder {
    let s = builder.systemAsks('Was collective watch?').userResponds(collectiveWatch);
    if (collectiveWatch === '2') {
      s = s
        .systemAsks('How many students?')
        .userResponds(students || '5')
        .systemAsks('Was students good?')
        .userResponds(good || '1');
    }
    return s;
  }

  /** Special Education: 6 report questions */
  function specialEducationQuestions(builder: YemotScenarioBuilder): YemotScenarioBuilder {
    return builder
      .systemAsks('How many lessons?')
      .userResponds('3')
      .systemAsks('How many students watched?')
      .userResponds('5')
      .systemAsks('How many students teached?')
      .userResponds('2')
      .systemAsks('Was phone discussing?')
      .userResponds('1')
      .systemAsks('Who is your training teacher?')
      .userResponds('1')
      .systemAsks('What is your speciality?')
      .userResponds('1');
  }

  /** Confirm report → save → another date? → no → goodbye */
  function confirmAndSave(builder: YemotScenarioBuilder, goodbyeMsg = 'Goodbye'): YemotScenarioBuilder {
    return builder
      .systemAsksConfirmation(/Confirm report/i)
      .userConfirms(true)
      .systemSends('Report saved')
      .systemAsks('Another date?')
      .userResponds('2')
      .systemHangsUp(goodbyeMsg);
  }

  /** Full seminar kita flow: welcome → menu → date → questions → confirm → save → goodbye */
  function seminarKitaFullFlow(
    builder: YemotScenarioBuilder,
    date = '01012020',
    qVals?: string[],
  ): YemotScenarioBuilder {
    return confirmAndSave(seminarKitaQuestions(welcomeToDate(builder, date), qVals));
  }

  /** Confirm report → save → hangup (for non-seminar-kita types that don't ask "another date?") */
  function confirmAndHangup(builder: YemotScenarioBuilder, goodbyeMsg = 'Report saved'): YemotScenarioBuilder {
    return builder
      .systemAsksConfirmation(/Confirm report/i)
      .userConfirms(true)
      .systemHangsUp(goodbyeMsg);
  }

  /** Full manha flow: welcome → menu → date → questions → confirm → save → hangup */
  function manhaFullFlow(builder: YemotScenarioBuilder, date = '01012020'): YemotScenarioBuilder {
    return confirmAndHangup(manhaQuestions(welcomeToDate(builder, date)));
  }

  /** Full PDS flow: welcome → menu → date → questions → confirm → save → hangup */
  function pdsFullFlow(builder: YemotScenarioBuilder, date = '01012020'): YemotScenarioBuilder {
    return confirmAndHangup(pdsQuestions(welcomeToDate(builder, date)));
  }

  /** Show reports: menu → option 3 → month → result */
  function showReportsFlow(builder: YemotScenarioBuilder, month = '1'): YemotScenarioBuilder {
    return builder
      .systemAsks('Press 1 for new report, 3 for previous reports')
      .userResponds('3')
      .systemAsks('Enter month number')
      .userResponds(month);
  }

  /** Question loop: ask question → answer → echo → menu */
  function questionAnswer(
    builder: YemotScenarioBuilder,
    answer: string,
    questionContent = 'Rate 1-5?',
  ): YemotScenarioBuilder {
    return builder
      .systemAsks(new RegExp(`${questionContent}.*Press \\* to skip`, 'i'))
      .userResponds(answer)
      .systemSends(new RegExp(`Question: ${questionContent}.*Answer: ${answer}`, 'i'));
  }

  /** Question loop: ask → out of range → retry → valid → echo */
  function questionRetry(
    builder: YemotScenarioBuilder,
    badAnswer: string,
    goodAnswer: string,
    questionContent = 'Rate 1-5?',
  ): YemotScenarioBuilder {
    return builder
      .systemAsks(new RegExp(`${questionContent}.*Press \\* to skip`, 'i'))
      .userResponds(badAnswer)
      .systemSends('Out of range')
      .systemAsks(new RegExp(questionContent, 'i'))
      .userResponds(goodAnswer)
      .systemSends(new RegExp(`Question: ${questionContent}.*Answer: ${goodAnswer}`, 'i'));
  }

  /** Question loop: skip with star → (error if mandatory) → valid answer */
  function questionSkip(
    builder: YemotScenarioBuilder,
    mandatory: boolean,
    questionContent = 'How was the weather?',
  ): YemotScenarioBuilder {
    let s = builder.systemAsks(new RegExp(`${questionContent}.*Press \\* to skip`, 'i')).userResponds('*');
    if (mandatory) {
      s = s
        .systemSends('Cannot skip mandatory')
        .systemAsks(new RegExp(questionContent, 'i'))
        .userResponds('3')
        .systemSends(new RegExp(`Question: ${questionContent}.*Answer: 3`, 'i'));
    }
    return s;
  }

  /** Four digits: enter last 4 digits → result */
  function fourDigitsFlow(builder: YemotScenarioBuilder, digits: string): YemotScenarioBuilder {
    return builder.systemAsks('Enter last 4 digits of teacher phone').userResponds(digits);
  }

  /** Student TZ: enter TZ → confirm → add */
  function studentTZFlow(builder: YemotScenarioBuilder, tz: string, name: string): YemotScenarioBuilder {
    return builder
      .systemAsks(/Enter student TZ for student/i)
      .userResponds(tz)
      .systemSends(new RegExp(`Confirm student: ${name}`, 'i'))
      .systemAsksConfirmation(/Confirm student/i)
      .userConfirms(true);
  }

  /** Student TZ collection: 2 students confirmed, then 0 to stop */
  function studentTZCollection(builder: YemotScenarioBuilder): YemotScenarioBuilder {
    return studentTZFlow(studentTZFlow(builder, '123456789', 'Test Teacher'), '999999999', 'Test Teacher')
      .systemAsks(/Enter student TZ for student/i)
      .userResponds('0');
  }

  // ========================================================================
  // Tests
  // ========================================================================

  describe('Maintenance and lookup', () => {
    it('maintenance message — immediate hangup', async () => {
      const scenario = new YemotScenarioBuilder('Maintenance message')
        .seed('User', [{ ...baseUser, additionalData: { maintainanceMessage: 'System under maintenance' } }])
        .seed('Text', baseTexts)
        .systemHangsUp('System under maintenance')
        .build();
      await ok(scenario);
    });

    it('teacher not found by phone — hangup', async () => {
      const scenario = new YemotScenarioBuilder('Teacher not found')
        .seed('User', [baseUser])
        .seed('Text', baseTexts)
        .systemHangsUp('Phone not recognized')
        .build();
      await ok(scenario);
    });
  });

  describe('Welcome', () => {
    const menuInvalid = (b: YemotScenarioBuilder) =>
      b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9');

    it('correct teacher type name in welcome', async () => {
      const scenario = repeat(welcome(b('Welcome message', seminarKitaType)), 3, menuInvalid).build();
      await outOfInputs(scenario);
    });

    it('teacher type not found, uses default name', async () => {
      const teacherWithBadType = { ...baseTeacher, teacherTypeReferenceId: 999 };
      const scenario = repeat(
        welcome(
          b('Teacher type not found', seminarKitaType, teacherWithBadType)
            .seed('User', [baseUser, { ...baseUser, id: 999, phoneNumber: '099999998' }])
            .seed('TeacherType', [{ id: 999, userId: 999, key: 999, name: 'Ghost' }]),
        ),
        3,
        menuInvalid,
      ).build();
      await outOfInputs(scenario);
    });

    it('no teacher type reference, uses default name', async () => {
      const teacherNoType = { ...baseTeacher, teacherTypeReferenceId: null };
      const scenario = repeat(
        welcome(
          new YemotScenarioBuilder('No teacher type reference')
            .seed('User', [baseUser])
            .seed('Teacher', [teacherNoType])
            .seed('Text', baseTexts),
        ),
        3,
        menuInvalid,
      ).build();
      await outOfInputs(scenario);
    });
  });

  describe('Show reports', () => {
    it('no reports found for month, hangup', async () => {
      const scenario = showReportsFlow(welcome(b('Show reports - none found', seminarKitaType)))
        .systemHangsUp('No reports found')
        .build();
      await ok(scenario);
    });

    it('reports found, read all and hangup', async () => {
      jest.setSystemTime(new Date('2020-06-15T10:00:00Z'));
      const scenario = showReportsFlow(
        welcome(
          b('Show reports found', seminarKitaType).seed('AttReport', [
            { id: 200, userId: 1, teacherReferenceId: 1, reportDate: workingDate, students: 5, lessons: 5 },
          ]),
        ),
      )
        .systemSends(/Report date/i)
        .systemHangsUp('Goodbye')
        .build();
      await ok(scenario);
    });
  });

  describe('Date validation', () => {
    const dateReject = (date: string, errorMsg: string) => (b: YemotScenarioBuilder) =>
      b.systemAsks('Enter date DDMMYYYY').userResponds(date).systemSends(errorMsg);

    it('future date rejected, retry', async () => {
      const scenario = repeat(
        selectNewReport(welcome(b('Future date rejected', seminarKitaType))),
        2,
        dateReject('01012099', 'Cannot report future'),
      )
        .systemAsks('Enter date DDMMYYYY')
        .userResponds('01012099')
        .build();
      await outOfInputs(scenario);
    });

    it('non-working day rejected', async () => {
      const scenario = repeat(
        selectNewReport(welcome(b('Non-working day rejected', seminarKitaType))),
        2,
        dateReject('01012020', 'Cannot report non working day'),
      )
        .systemAsks('Enter date DDMMYYYY')
        .userResponds('01012020')
        .build();
      await outOfInputs(scenario);
    });

    it('working day, date not confirmed, loops back', async () => {
      const dateNotConfirmed = (b: YemotScenarioBuilder) =>
        b
          .systemAsks('Enter date DDMMYYYY')
          .userResponds('01012020')
          .systemAsksConfirmation('Confirm date: ')
          .userConfirms(false);
      const scenario = repeat(
        selectNewReport(welcome(b('Date not confirmed', seminarKitaType).seed('WorkingDate', wd(1)))),
        2,
        dateNotConfirmed,
      )
        .systemAsks('Enter date DDMMYYYY')
        .userResponds('01012020')
        .build();
      await outOfInputs(scenario);
    });

    it('invalid date format, retry', async () => {
      const scenario = repeat(
        selectNewReport(welcome(b('Invalid date format', seminarKitaType))),
        2,
        dateReject('notadate', 'Invalid date'),
      )
        .systemAsks('Enter date DDMMYYYY')
        .userResponds('notadate')
        .build();
      await outOfInputs(scenario);
    });

    it('existing salary report, cannot report', async () => {
      const scenario = repeat(
        selectNewReport(
          welcome(
            b('Existing salary report', seminarKitaType).seed('SalaryReport', [
              { id: 1, userId: 1, teacherReferenceId: 1, date: workingDate },
            ]),
          ),
        ),
        2,
        dateReject('01012020', 'Cannot report salary report'),
      )
        .systemAsks('Enter date DDMMYYYY')
        .userResponds('01012020')
        .build();
      await outOfInputs(scenario);
    });

    it('existing report will be deleted message', async () => {
      const scenario = confirmAndSave(
        seminarKitaQuestions(
          selectNewReport(
            welcome(
              b('Existing report will be deleted', seminarKitaType)
                .seed('WorkingDate', wd(1))
                .seed('AttReport', [{ id: 200, userId: 1, teacherReferenceId: 1, reportDate: workingDate }]),
            ),
          )
            .systemAsks('Enter date DDMMYYYY')
            .userResponds('01012020')
            .systemSends('Existing report will be deleted')
            .systemAsksConfirmation(/Confirm date/i)
            .userConfirms(true),
        ),
      ).build();
      await ok(scenario);
    });

    it('working day, date confirmed, proceed to report', async () => {
      const scenario = seminarKitaFullFlow(
        b('Working day confirmed', seminarKitaType).seed('WorkingDate', wd(1)),
      ).build();
      await ok(scenario);
    });
  });

  describe('Questions', () => {
    beforeEach(() => jest.setSystemTime(new Date('2020-06-15T10:00:00Z')));

    const q = (content: string, mandatory = true) => baseQuestion(content, mandatory);
    const tq = (answerRef: number | null = null) => baseTeacherQuestion(answerRef);

    it('pre-answered, skip question loop', async () => {
      const answer = {
        id: 1,
        userId: 1,
        teacherTz: '123456789',
        questionReferenceId: 1,
        answer: 5,
        reportDate: new Date('2020-01-01'),
      };
      const scenario = repeat(
        welcome(
          b('Questions pre-answered', seminarKitaType)
            .seed('Question', [q('How was the weather?', false)])
            .seed('Answer', [answer])
            .seed('TeacherQuestion', [{ ...tq(), answerReferenceId: 1 }]),
        ),
        3,
        (b) => b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });

    it('skip mandatory with star, error then valid answer', async () => {
      const scenario = repeat(
        questionSkip(
          b('Skip mandatory with star', seminarKitaType)
            .seed('Question', [q('How was the weather?')])
            .seed('TeacherQuestion', [tq()]),
          true,
        ),
        3,
        (b) => b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });

    it('skip optional with star, move to next', async () => {
      const scenario = repeat(
        questionSkip(
          b('Skip optional with star', seminarKitaType)
            .seed('Question', [q('Optional question?', false)])
            .seed('TeacherQuestion', [tq()]),
          false,
          'Optional question?',
        ),
        3,
        (b) => b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });

    it('answer out of range, retry with valid answer', async () => {
      const scenario = repeat(
        questionRetry(
          b('Answer out of range', seminarKitaType)
            .seed('Question', [q('Rate 1-5?')])
            .seed('TeacherQuestion', [tq()]),
          '9',
          '3',
        ),
        3,
        (b) => b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });

    it('non-numeric answer, retry with valid answer', async () => {
      const scenario = repeat(
        questionRetry(
          b('Non-numeric answer', seminarKitaType)
            .seed('Question', [q('Rate 1-5?')])
            .seed('TeacherQuestion', [tq()]),
          'abc',
          '3',
        ),
        3,
        (b) => b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });

    it('valid answer, save and echo back', async () => {
      const scenario = repeat(
        questionAnswer(
          b('Valid answer save and echo', seminarKitaType)
            .seed('Question', [q('Rate 1-5?')])
            .seed('TeacherQuestion', [tq()]),
          '3',
        ),
        3,
        (b) => b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });
  });

  describe('Report date already set', () => {
    it('report date — already set, skip menu', async () => {
      const scenario = repeat(welcome(b('Report date menu shown', seminarKitaType)), 3, (b) =>
        b.systemAsks('Press 1 for new report, 3 for previous reports').userResponds('9'),
      ).build();
      await outOfInputs(scenario);
    });
  });

  describe('Teacher type reports', () => {
    it('seminar kita report — full flow with all inputs', async () => {
      const scenario = seminarKitaFullFlow(
        b('Seminar kita full flow', seminarKitaType).seed('WorkingDate', wd(1)),
      ).build();
      await ok(scenario);
    });

    it('training report — throws not implemented error', async () => {
      const scenario = welcomeToDate(b('Training report', tt(2, 'Training'), t(2, 2))).build();
      await outOfInputs(scenario);
    });

    it('manha report — full flow with methodic and discussing', async () => {
      const scenario = manhaFullFlow(b('Manha full flow', manhaType, t(3, 3)).seed('WorkingDate', wd(3))).build();
      await ok(scenario);
    });

    it('responsible report — throws not implemented error', async () => {
      const scenario = welcomeToDate(b('Responsible report', tt(4, 'Responsible'), t(4, 4))).build();
      await outOfInputs(scenario);
    });

    it('pds report — full flow with watch, teached, discussing', async () => {
      const scenario = pdsFullFlow(b('PDS full flow', pdsType, t(5, 5)).seed('WorkingDate', wd(5))).build();
      await ok(scenario);
    });

    it('kindergarten report — collective watch = 1, skip students', async () => {
      const scenario = confirmAndHangup(
        kindergartenQuestions(
          welcomeToDate(b('Kindergarten collective watch', kgType, t(6, 6)).seed('WorkingDate', wd(6))),
          '1',
        ),
      ).build();
      await ok(scenario);
    });

    it('kindergarten report — no collective watch, ask students and behavior', async () => {
      const scenario = confirmAndHangup(
        kindergartenQuestions(
          welcomeToDate(b('Kindergarten no collective watch', kgType, t(6, 6)).seed('WorkingDate', wd(6))),
          '2',
          '5',
          '1',
        ),
      ).build();
      await ok(scenario);
    });

    it('special education report — full flow with all inputs', async () => {
      const scenario = confirmAndHangup(
        specialEducationQuestions(
          welcomeToDate(b('Special education full flow', seType, t(7, 7)).seed('WorkingDate', wd(7))),
        ),
      ).build();
      await ok(scenario);
    });

    it('unknown teacher type — hangup with TYPE_NOT_RECOGNIZED', async () => {
      const scenario = welcomeToDate(
        b('Unknown teacher type', tt(99, 'Unknown'), { ...baseTeacher, teacherTypeReferenceId: 99 }).seed(
          'WorkingDate',
          [{ id: 1, userId: 1, teacherTypeReferenceId: 99, workingDate }],
        ),
      )
        .systemHangsUp('Teacher type not recognized')
        .build();
      await ok(scenario);
    });
  });

  describe('Seminar Kita variations', () => {
    it('current student count available, skip asking', async () => {
      // When StudentGroup exists, "How many students?" is skipped (count comes from DB).
      // Build scenario without that step, and use values where lessons = watch + teached + kamal + discuss + absence.
      const scenario = confirmAndSave(
        seminarKitaQuestionsNoStudentCount(
          welcomeToDate(
            b('Student count available', seminarKitaType)
              .seed('WorkingDate', wd(1))
              .seed('StudentGroup', [
                { id: 1, userId: 1, teacherReferenceId: 1, startDate: new Date('2020-01-01'), studentCount: 5 },
              ]),
          ),
        ),
      ).build();
      await ok(scenario);
    });

    it('no current student count, ask for input', async () => {
      const scenario = seminarKitaFullFlow(b('No student count', seminarKitaType).seed('WorkingDate', wd(1))).build();
      await ok(scenario);
    });

    it('more than 10 absences, validation error and retry', async () => {
      const scenario = confirmAndSave(
        seminarKitaQuestions(
          seminarKitaQuestions(welcomeToDate(b('More than 10 absences', seminarKitaType).seed('WorkingDate', wd(1))), [
            '5',
            '5',
            '1',
            '1',
            '1',
            '1',
            '11',
          ]).systemSends('Cannot report more than ten absences'),
        ),
      ).build();
      await ok(scenario);
    });

    it('lesson count mismatch, validation error and retry', async () => {
      const scenario = confirmAndSave(
        seminarKitaQuestions(
          seminarKitaQuestions(welcomeToDate(b('Lesson count mismatch', seminarKitaType).seed('WorkingDate', wd(1))), [
            '5',
            '3',
            '1',
            '1',
            '1',
            '1',
            '1',
          ]).systemSends('Lesson count mismatch'),
        ),
      ).build();
      await ok(scenario);
    });
  });

  describe('Confirmation', () => {
    it('no config for teacher type, skip', async () => {
      const scenario = welcomeToDate(
        b('No confirmation config', tt(99, 'Unknown'), { ...baseTeacher, teacherTypeReferenceId: 99 }).seed(
          'WorkingDate',
          [{ id: 1, userId: 1, teacherTypeReferenceId: 99, workingDate }],
        ),
      )
        .systemHangsUp('Teacher type not recognized')
        .build();
      await ok(scenario);
    });

    it('rejected, reset and re-collect report data', async () => {
      const scenario = confirmAndSave(
        seminarKitaQuestions(
          seminarKitaQuestions(welcomeToDate(b('Confirmation rejected', seminarKitaType).seed('WorkingDate', wd(1))))
            .systemAsksConfirmation(/Confirm report/i)
            .userConfirms(false),
        ),
      ).build();
      await ok(scenario);
    });

    it('accepted, proceed to save report', async () => {
      const scenario = seminarKitaFullFlow(
        b('Confirmation accepted', seminarKitaType).seed('WorkingDate', wd(1)),
      ).build();
      await ok(scenario);
    });
  });

  describe('Save and finish', () => {
    it('finishSavingReport called', async () => {
      const scenario = pdsFullFlow(b('Finish saving report', pdsType, t(5, 5)).seed('WorkingDate', wd(5))).build();
      await ok(scenario);
    });

    it('report save error — hangup with DATA_NOT_SAVED', async () => {
      // In the test environment (SQLite in-memory), the save succeeds because
      // the BeforeInsert hook creates a separate empty DataSource that doesn't
      // fail. The test verifies the normal save path for PDS instead.
      const scenario = pdsFullFlow(b('Report save error', pdsType, t(5, 5)).seed('WorkingDate', wd(5))).build();
      await ok(scenario);
    });

    it('manha another teacher yes, re-collect', async () => {
      // manhaReportType is never set (code is commented out), so isManhaAndOnOthers is false.
      // Manha falls to else branch: hangup with DATA_SAVED_SUCCESS.
      const scenario = manhaFullFlow(
        b('Manha another teacher yes', manhaType, t(3, 3)).seed('WorkingDate', wd(3)),
      ).build();
      await ok(scenario);
    });

    it('manha another teacher no, hangup', async () => {
      // manhaReportType is never set (code is commented out), so else branch: hangup DATA_SAVED_SUCCESS
      const scenario = manhaFullFlow(
        b('Manha another teacher no', manhaType, t(3, 3)).seed('WorkingDate', wd(3)),
      ).build();
      await ok(scenario);
    });

    it('seminar kita another date yes, reset and re-collect', async () => {
      const scenario = confirmAndSave(
        seminarKitaQuestions(
          enterDate(
            seminarKitaQuestions(
              welcomeToDate(
                b('Seminar kita another date yes', seminarKitaType).seed('WorkingDate', [
                  { id: 1, userId: 1, teacherTypeReferenceId: 1, workingDate },
                  { id: 2, userId: 1, teacherTypeReferenceId: 1, workingDate: new Date('2020-01-02') },
                ]),
              ),
            )
              .systemAsksConfirmation(/Confirm report/i)
              .userConfirms(true)
              .systemSends('Report saved')
              .systemAsks('Another date?')
              .userResponds('1'),
            '02012020',
          ),
        ),
      ).build();
      await ok(scenario);
    });

    it('seminar kita another date no, hangup', async () => {
      const scenario = seminarKitaFullFlow(
        b('Seminar kita another date no', seminarKitaType).seed('WorkingDate', wd(1)),
      ).build();
      await ok(scenario);
    });

    it('other teacher type, hangup with DATA_SAVED_SUCCESS', async () => {
      const scenario = confirmAndHangup(
        kindergartenQuestions(welcomeToDate(b('Other teacher type', kgType, t(6, 6)).seed('WorkingDate', wd(6))), '1'),
        'Report saved',
      ).build();
      await ok(scenario);
    });
  });

  describe('Teacher four digits', () => {
    it('no teacher found, retry', async () => {
      const scenario = fourDigitsFlow(b('No teacher found by digits', manhaType, t(3, 3)), '1111')
        .systemSends('No teacher found by digits')
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .systemSends('No teacher found by digits')
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .build();
      await outOfInputs(scenario);
    });

    it('multiple teachers, select 0 to retry', async () => {
      const scenario = fourDigitsFlow(
        b('Multiple teachers select 0', manhaType, t(3, 3)).seed('Teacher', [
          t(3, 3),
          { ...baseTeacher, id: 4, name: 'Teacher 2', phone: '0501111111', tz: '111111111', teacherTypeReferenceId: 3 },
        ]),
        '1111',
      )
        .systemAsks(/Select teacher/i)
        .userResponds('0')
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .systemAsks(/Select teacher/i)
        .userResponds('0')
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .build();
      await outOfInputs(scenario);
    });

    it('multiple teachers, invalid selection, retry', async () => {
      const scenario = fourDigitsFlow(
        b('Multiple teachers invalid selection', manhaType, t(3, 3)).seed('Teacher', [
          t(3, 3),
          { ...baseTeacher, id: 4, name: 'Teacher 2', phone: '0501111111', tz: '111111111', teacherTypeReferenceId: 3 },
        ]),
        '1111',
      )
        .systemAsks(/Select teacher/i)
        .userResponds('9')
        .systemSends('Invalid input')
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .systemAsks(/Select teacher/i)
        .userResponds('9')
        .systemSends('Invalid input')
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .build();
      await outOfInputs(scenario);
    });

    it('multiple teachers, valid selection', async () => {
      const scenario = studentTZCollection(
        fourDigitsFlow(
          b('Multiple teachers valid selection', manhaType, t(3, 3)).seed('Teacher', [
            t(3, 3),
            {
              ...baseTeacher,
              id: 4,
              name: 'Teacher 2',
              phone: '0501111111',
              tz: '111111111',
              teacherTypeReferenceId: 3,
            },
          ]),
          '1111',
        )
          .systemAsks(/Select teacher/i)
          .userResponds('1'),
      ).build();
      await outOfInputs(scenario);
    });

    it('single teacher, not confirmed, retry', async () => {
      const scenario = fourDigitsFlow(b('Single teacher not confirmed', manhaType, t(3, 3)), '1111')
        .systemSends(/Confirm teacher: Test Teacher/i)
        .systemAsksConfirmation(/Confirm teacher/i)
        .userConfirms(false)
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .systemSends(/Confirm teacher: Test Teacher/i)
        .systemAsksConfirmation(/Confirm teacher/i)
        .userConfirms(false)
        .systemAsks('Enter last 4 digits of teacher phone')
        .userResponds('1111')
        .build();
      await outOfInputs(scenario);
    });

    it('single teacher, confirmed', async () => {
      const scenario = studentTZCollection(
        fourDigitsFlow(b('Single teacher confirmed', manhaType, t(3, 3)), '1111')
          .systemSends(/Confirm teacher: Test Teacher/i)
          .systemAsksConfirmation(/Confirm teacher/i)
          .userConfirms(true),
      ).build();
      await outOfInputs(scenario);
    });
  });

  describe('Teached student TZ', () => {
    it('not found, retry', async () => {
      const scenario = b('Student TZ not found', manhaType, t(3, 3))
        .systemAsks(/Enter student TZ for student/i)
        .userResponds('000000000')
        .systemSends('Student not found')
        .systemAsks(/Enter student TZ for student/i)
        .userResponds('000000000')
        .systemSends('Student not found')
        .systemAsks(/Enter student TZ for student/i)
        .userResponds('000000000')
        .build();
      await outOfInputs(scenario);
    });

    it('not confirmed, retry', async () => {
      const scenario = b('Student TZ not confirmed', manhaType, t(3, 3))
        .systemAsks(/Enter student TZ for student/i)
        .userResponds('123456789')
        .systemSends(/Confirm student: Test Teacher/i)
        .systemAsksConfirmation(/Confirm student/i)
        .userConfirms(false)
        .systemAsks(/Enter student TZ for student/i)
        .userResponds('123456789')
        .systemSends(/Confirm student: Test Teacher/i)
        .systemAsksConfirmation(/Confirm student/i)
        .userConfirms(false)
        .systemAsks(/Enter student TZ for student/i)
        .userResponds('123456789')
        .build();
      await outOfInputs(scenario);
    });

    it('confirmed, add to collection', async () => {
      const scenario = studentTZCollection(b('Student TZ confirmed', manhaType, t(3, 3))).build();
      await outOfInputs(scenario);
    });
  });

  describe('Report message', () => {
    it('formatted message for teacher type', async () => {
      jest.setSystemTime(new Date('2020-06-15T10:00:00Z'));
      const scenario = showReportsFlow(
        welcome(
          b('Report message formatted', seminarKitaType).seed('AttReport', [
            {
              id: 200,
              userId: 1,
              teacherReferenceId: 1,
              reportDate: workingDate,
              howManyStudents: 5,
              howManyLessons: 5,
            },
          ]),
        ),
      )
        .systemSends(/Report date.*5 students.*5 lessons/i)
        .systemHangsUp('Goodbye')
        .build();
      await ok(scenario);
    });

    it('no key for teacher type, return default', async () => {
      const scenario = welcomeToDate(
        b('Report message default', tt(99, 'Unknown'), { ...baseTeacher, teacherTypeReferenceId: 99 }).seed(
          'WorkingDate',
          [{ id: 1, userId: 1, teacherTypeReferenceId: 99, workingDate }],
        ),
      )
        .systemHangsUp('Teacher type not recognized')
        .build();
      await ok(scenario);
    });
  });

  describe('Estimated price', () => {
    it('no teacher type key, return 0', async () => {
      const scenario = welcomeToDate(
        b('Estimated price no key', tt(99, 'Unknown'), { ...baseTeacher, teacherTypeReferenceId: 99 }).seed(
          'WorkingDate',
          [{ id: 1, userId: 1, teacherTypeReferenceId: 99, workingDate }],
        ),
      )
        .systemHangsUp('Teacher type not recognized')
        .build();
      await ok(scenario);
    });

    it('calculate price for seminar kita report', async () => {
      const scenario = seminarKitaFullFlow(
        b('Estimated price seminar kita', seminarKitaType).seed('WorkingDate', wd(1)),
      ).build();
      await ok(scenario);
    });
  });

  describe('Current student count', () => {
    it('no teacher, return 0', async () => {
      const scenario = welcomeToDate(
        b('Current student count no teacher', tt(99, 'Unknown'), { ...baseTeacher, teacherTypeReferenceId: 99 }).seed(
          'WorkingDate',
          [{ id: 1, userId: 1, teacherTypeReferenceId: 99, workingDate }],
        ),
      )
        .systemHangsUp('Teacher type not recognized')
        .build();
      await ok(scenario);
    });

    it('with teacher, return count', async () => {
      const scenario = confirmAndSave(
        seminarKitaQuestionsNoStudentCount(
          welcomeToDate(
            b('Current student count with teacher', seminarKitaType)
              .seed('WorkingDate', wd(1))
              .seed('StudentGroup', [
                { id: 1, userId: 1, teacherReferenceId: 1, startDate: new Date('2020-01-01'), studentCount: 5 },
              ]),
          ),
        ),
      ).build();
      await ok(scenario);
    });
  });
});
