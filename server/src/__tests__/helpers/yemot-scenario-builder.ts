/**
 * Scenario Builder - Fluent API for creating test scenarios
 *
 * Provides a more intuitive way to build test scenarios with method chaining.
 * This extends the generic framework with project-specific helper methods.
 */

import { GenericScenarioBuilder } from '@shared/utils/yemot/testing/yemot-test-framework-builder';
import { MessageMatcher } from '@shared/utils/yemot/testing/yemot-test-framework.types';
import { TestScenario, DatabaseSetup, ScenarioStep, ExpectedResult } from './yemot-test-scenario.types';
import { TeacherTypeId } from '../../utils/fieldsShow.util';

export class ScenarioBuilder extends GenericScenarioBuilder<TestScenario, DatabaseSetup> {
  protected setupData: Partial<DatabaseSetup> = {
    texts: [],
  };

  constructor(name: string) {
    super(name);
  }

  /**
   * Configure user
   */
  withUser(user: DatabaseSetup['user']): this {
    this.setupData.user = user;
    return this;
  }

  /**
   * Configure teacher with common defaults
   */
  withTeacher(teacher: Partial<DatabaseSetup['teacher']> & { teacherTypeKey: TeacherTypeId }): this {
    this.setupData.teacher = {
      id: teacher.id || 1,
      userId: teacher.userId || 1,
      name: teacher.name || 'מורה טסט',
      phone: teacher.phone || '0527609942',
      tz: teacher.tz || '123456789',
      teacherTypeReferenceId: teacher.teacherTypeReferenceId || 1,
      teacherType: {
        id: teacher.teacherType?.id || 1,
        key: teacher.teacherTypeKey,
        name: teacher.teacherType?.name || this.getTeacherTypeName(teacher.teacherTypeKey),
      },
    };
    return this;
  }

  /**
   * Add working dates (defaults to today if not specified)
   */
  withWorkingDates(dates?: Date[]): this {
    const datesToUse = dates || [new Date()];
    this.setupData.workingDates = datesToUse.map((date, index) => ({
      id: index + 1,
      date,
      teacherTypeReferenceId: this.setupData.teacher?.teacherTypeReferenceId || 1,
      userId: this.setupData.user?.id || 1,
    }));
    return this;
  }

  /**
   * Add students
   */
  withStudents(count: number, customStudents?: any[]): this {
    if (customStudents) {
      this.setupData.students = customStudents;
    } else {
      this.setupData.students = Array(count)
        .fill(null)
        .map((_, i) => ({
          id: i + 1,
          name: `תלמידה ${i + 1}`,
          tz: String((i + 1) * 111111111).padStart(9, '0'),
        }));
    }
    return this;
  }

  /**
   * Add existing reports
   */
  withExistingReports(reports: any[]): this {
    this.setupData.existingReports = reports;
    return this;
  }

  /**
   * Add questions
   */
  withQuestions(questions: any[]): this {
    this.setupData.questions = questions;
    return this;
  }

  /**
   * Add teacher question assignments
   */
  withTeacherQuestions(assignments: any[]): this {
    this.setupData.teacherQuestions = assignments;
    return this;
  }

  /**
   * Add other teachers (for MANHA lookups)
   */
  withOtherTeachers(teachers: any[]): this {
    this.setupData.otherTeachers = teachers;
    return this;
  }

  /**
   * Add text translation
   */
  addText(key: string, value: string, filepath?: string): this {
    this.setupData.texts.push({
      userId: this.setupData.user?.id || 1,
      name: key,
      value,
      filepath: filepath || null,
    });
    return this;
  }

  /**
   * Add multiple standard texts at once
   */
  withStandardTexts(teacherType: TeacherTypeId): this {
    // Common texts for all types
    this.addText('TEACHER.WELCOME', 'שלום {name}, ברוכה הבאה למערכת דיווחי {teacherTypeName}');
    this.addText('REPORT.MAIN_MENU', 'לחצי 1 לתיקוף נוכחות, 3 לשמיעת דיווחים קודמים');
    this.addText('REPORT.CHOOSE_DATE', 'הקישי תאריך בפורמט יום חודש שנה');
    this.addText('REPORT.CONFIRM_DATE', 'התאריך הוא {date}, לאישור הקישי 1, לשינוי הקישי 2');
    this.addText('GENERAL.YES', 'כן');
    this.addText('GENERAL.NO', 'לא');
    this.addText('REPORT.DATA_SAVED_SUCCESS', 'הדיווח נשמר בהצלחה');
    this.addText('REPORT.GOODBYE_TO_MANHA_TEACHER', 'תודה ולהתראות');

    // Type-specific texts
    switch (teacherType) {
      case TeacherTypeId.SEMINAR_KITA:
        this.addText('REPORT.HOW_MANY_LESSONS_SEMINAR_KITA', 'על כמה שיעורי סמינר כתה תרצי לדווח');
        this.addText('REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL', 'מתוכם כמה שיעורי צפיה או פרטני');
        this.addText('REPORT.HOW_MANY_TEACHED_OR_INTERFERING', 'כמה שיעורי מסירה או מעורבות');
        this.addText('REPORT.WAS_KAMAL', 'האם היה קמל, הקישי 1 לכן או 0 לאו');
        this.addText('REPORT.HOW_MANY_DISCUSSING_LESSONS', 'כמה שיעורי דיון');
        this.addText('REPORT.HOW_MANY_LESSONS_ABSENCE_SEMINAR_KITA', 'כמה שיעורים התלמידות חסרו');
        this.addText(
          'REPORT.VALIDATION_CONFIRM_SEMINAR_KITA',
          'דיווח: {students} תלמידות, {lessons} שיעורים, {watchIndiv} צפיות, {teachInterf} מסירות, קמל: {kamal}, {discuss} דיונים, {absence} חיסורים. לאישור הקישי 1',
        );
        this.addText('VALIDATION.SEMINAR_KITA_LESSON_COUNT', 'המספר לא תואם, נסי שוב');
        this.addText('VALIDATION.CANNOT_REPORT_MORE_THAN_TEN_ABSENCES', 'לא ניתן לדווח על יותר מ-10 חיסורים');
        this.addText('REPORT.ANOTHER_DATE_REPORT', 'האם תרצי לדווח על יום נוסף? הקישי 1 לכן, 2 לאו');
        break;

      case TeacherTypeId.MANHA:
        this.addText('REPORT.MANHA_REPORT_TYPE', 'האם מדווחת על עצמך או על מורות אחרות? 1=עצמי, 2=אחרות');
        this.addText('REPORT.HOW_MANY_METHODIC', 'כמה שיעורי מתודיקה היו');
        this.addText('REPORT.TEACHER_4_DIGITS', 'הקישי 4 ספרות אחרונות של טלפון המורה');
        this.addText('REPORT.IS_TAARIF_HULIA', 'כמה שיעורי צפיה בחוליה רגילה');
        this.addText('REPORT.IS_TAARIF_HULIA2', 'כמה שעורי צפיה בחוליה גדולה');
        this.addText('REPORT.IS_TAARIF_HULIA3', 'כמה שיעורים היו בחוליה ה 2');
        this.addText('REPORT.HOW_MANY_WATCHED_LESSONS', 'כמה שיעורי צפיה');
        this.addText('REPORT.HOW_MANY_STUDENTS_TEACHED', 'כמה בנות מסרו היום שיעור');
        this.addText('STUDENT.TZ_PROMPT', 'הקישי את מ.ז. של התלמידה מספר {number}');
        this.addText('STUDENT.CONFIRM', 'האם התלמידה היא {studentName}? 1=כן, 2=לא');
        this.addText('STUDENT.NOT_FOUND', 'תלמידה לא נמצאה, נסי שוב');
        this.addText('REPORT.HOW_MANY_YALKUT_LESSONS', 'כמה שיעורי ילקוט הרועים');
        this.addText('REPORT.HOW_MANY_STUDENTS_HELP_TEACHED', 'כמה שיעורי מרתון עזרת לתלמידות למסור');
        this.addText('REPORT.VALIDATION_CONFIRM_MANHA', 'דיווח למורה {teacherName}...');
        this.addText('REPORT.ANOTHER_TEACHER_REPORT', 'האם תרצי לדווח על מורה נוספת? 1=כן, 2=לא');
        break;

      case TeacherTypeId.PDS:
        this.addText('REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL', 'כמה שיעורי צפיה או פרטני');
        this.addText('REPORT.HOW_MANY_TEACHED_OR_INTERFERING', 'כמה שיעורי מסירה או מעורבות');
        this.addText('REPORT.HOW_MANY_DISCUSSING_LESSONS', 'כמה שיעורי דיון');
        this.addText('REPORT.VALIDATION_CONFIRM_PDS', 'דיווח PDS...');
        break;

      case TeacherTypeId.KINDERGARTEN:
        this.addText('REPORT.WAS_COLLECTIVE_WATCH', 'האם הייתה צפיה קולקטיבית? 1=כן, 0=לא');
        this.addText('REPORT.HOW_MANY_STUDENTS', 'כמה בנות היו בצפיה בגן');
        this.addText('REPORT.WAS_STUDENTS_GOOD', 'האם תפקוד הבנות ענה על ציפיותיך? 1=כן, 0=לא');
        this.addText('REPORT.VALIDATION_CONFIRM_KINDERGARTEN', 'דיווח גננות...');
        break;

      case TeacherTypeId.SPECIAL_EDUCATION:
        this.addText('REPORT.HOW_MANY_LESSONS', 'כמה שיעורים היו');
        this.addText('REPORT.HOW_MANY_STUDENTS_WATCHED', 'כמה תלמידות צפית');
        this.addText('REPORT.HOW_MANY_STUDENTS_TEACHED', 'כמה תלמידות מסרו');
        this.addText('REPORT.WAS_PHONE_DISCUSSING', 'האם היה דיון טלפוני? 1=כן, 0=לא');
        this.addText('REPORT.WHAT_IS_YOUR_SPECIALITY', 'מה ההתמחות שלך');
        this.addText('REPORT.VALIDATION_CONFIRM_SPECIAL_EDUCATION', 'דיווח חינוך מיוחד...');
        break;
    }

    return this;
  }

  /**
   * Helper: Add complete date selection flow
   */
  dateSelectionFlow(date?: Date, confirmDate = true): this {
    const dateToUse = date || new Date();
    const dateStr = `${String(dateToUse.getDate()).padStart(2, '0')}${String(dateToUse.getMonth() + 1).padStart(
      2,
      '0',
    )}${dateToUse.getFullYear()}`;

    this.systemAsks({ contains: 'תאריך' }, dateStr, 'Enter date');
    if (confirmDate) {
      this.systemAsks({ contains: 'לאישור' }, '1', 'Confirm date');
    }
    return this;
  }

  /**
   * Helper: Add SEMINAR_KITA data collection flow
   */
  seminarKitaDataFlow(data: {
    lessons: number;
    watch: number;
    teach: number;
    kamal: boolean;
    discuss: number;
    absence: number;
  }): this {
    this.systemAsks({ contains: 'שיעורי סמינר כתה' }, String(data.lessons), 'How many lessons');
    this.systemAsks({ contains: 'צפיה או פרטני' }, String(data.watch), 'Watch/individual');
    this.systemAsks({ contains: 'מסירה או מעורבות' }, String(data.teach), 'Teach/interfere');
    this.systemAsks({ contains: 'קמל' }, data.kamal ? '1' : '0', 'Was kamal');
    this.systemAsks({ contains: 'דיון' }, String(data.discuss), 'Discussing lessons');
    this.systemAsks({ contains: 'חסרו' }, String(data.absence), 'Absences');
    return this;
  }

  /**
   * Helper: Add PDS data collection flow
   */
  pdsDataFlow(data: { watch: number; teach: number; discuss: number }): this {
    this.systemAsks({ contains: 'צפיה או פרטני' }, String(data.watch), 'Watch/individual');
    this.systemAsks({ contains: 'מסירה או מעורבות' }, String(data.teach), 'Teach/interfere');
    this.systemAsks({ contains: 'דיון' }, String(data.discuss), 'Discussing lessons');
    return this;
  }

  /**
   * Set expected result
   */
  expectResult(result: ExpectedResult): this {
    this.scenario.expectedResult = result;
    return this;
  }

  /**
   * Expect saved report with specific data
   */
  expectSavedReport(reportData: any): this {
    if (!this.scenario.expectedResult) {
      this.scenario.expectedResult = {};
    }
    this.scenario.expectedResult.savedReport = reportData;
    return this;
  }

  /**
   * Expect saved answers for questions
   */
  expectSavedAnswers(answers: any[]): this {
    if (!this.scenario.expectedResult) {
      this.scenario.expectedResult = {};
    }
    this.scenario.expectedResult.savedAnswers = answers;
    return this;
  }

  /**
   * Expect call to end
   */
  expectCallEnded(ended = true): this {
    if (!this.scenario.expectedResult) {
      this.scenario.expectedResult = { callEnded: ended };
    } else {
      this.scenario.expectedResult.callEnded = ended;
    }
    return this;
  }

  /**
   * Build the final scenario
   */
  build(): TestScenario {
    if (!this.setupData.user || !this.setupData.teacher) {
      throw new Error('Scenario must have user and teacher configured');
    }
    if (!this.scenario.expectedResult) {
      throw new Error('Scenario must have expected result configured');
    }

    this.scenario.setup = this.setupData as DatabaseSetup;
    return this.scenario as TestScenario;
  }

  private getTeacherTypeName(key: TeacherTypeId): string {
    const names: Record<TeacherTypeId, string> = {
      [TeacherTypeId.SEMINAR_KITA]: 'סמינר כתה',
      [TeacherTypeId.TRAINING]: 'מאמנת',
      [TeacherTypeId.MANHA]: 'מנחה',
      [TeacherTypeId.RESPONSIBLE]: 'אחראית',
      [TeacherTypeId.PDS]: 'פידיאס',
      [TeacherTypeId.KINDERGARTEN]: 'גננות',
      [TeacherTypeId.SPECIAL_EDUCATION]: 'חינוך מיוחד',
    };
    return names[key] || 'מורה';
  }
}

/**
 * Create a new scenario builder
 */
export function scenario(name: string): ScenarioBuilder {
  return new ScenarioBuilder(name);
}
