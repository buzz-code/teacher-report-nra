import { Injectable } from '@nestjs/common';
import { BaseYemotHandlerService } from '../shared/utils/yemot/v2/yemot-router.service';
import { Teacher } from 'src/db/entities/Teacher.entity';
import { Student } from 'src/db/entities/Student.entity';
import { TeacherType } from 'src/db/entities/TeacherType.entity';
import { AttReport } from 'src/db/entities/AttReport.entity';
import { Question } from 'src/db/entities/Question.entity';
import { Answer } from 'src/db/entities/Answer.entity';
import { WorkingDate } from 'src/db/entities/WorkingDate.entity';
import { TeacherQuestion } from 'src/db/entities/TeacherQuestion.entity';
import { getCurrentHebrewYear } from '@shared/utils/entity/year.util';
import { Like, IsNull, Between } from 'typeorm';
import { formatHebrewDateForIVR } from '@shared/utils/formatting/hebrew.util';
import { TeacherTypeId } from 'src/utils/fieldsShow.util';

// Interfaces for generic confirmation
interface ConfirmationField {
  paramKey: string;
  translationKey: string;
  formatter: (value: any, context?: any) => string;
}

interface ReportConfirmationConfig {
  textKey: string;
  fields: ConfirmationField[];
  preValidation?: () => Promise<void>;
}

// Built-in formatters for common field types
const FORMATTERS = {
  boolean: (value: any) => (value === '1' ? '1' : '0'),
  number: (value: any) => value?.toString() || '0',
  string: (value: any) => value || '',
  array: (value: any) => {
    if (typeof value === 'string' && value.endsWith(',')) {
      return value.slice(0, -1); // Remove trailing comma
    }
    return value || '';
  },
};

@Injectable()
export class YemotHandlerService extends BaseYemotHandlerService {
  private teacher: Teacher;
  private existingReport: AttReport;
  private reportDate: string;
  private callParams: any = {}; // Store call parameters
  private teacherToReportFor: Teacher;

  // Confirmation configurations for all teacher types
  private readonly CONFIRMATION_CONFIGS: Record<TeacherTypeId, ReportConfirmationConfig> = {
    [TeacherTypeId.SEMINAR_KITA]: {
      textKey: 'REPORT.VALIDATION_CONFIRM_SEMINAR_KITA',
      fields: [
        { paramKey: 'howManyStudents', translationKey: 'students', formatter: FORMATTERS.number },
        { paramKey: 'howManyLessons', translationKey: 'lessons', formatter: FORMATTERS.number },
        { paramKey: 'howManyWatchOrIndividual', translationKey: 'watchIndiv', formatter: FORMATTERS.number },
        { paramKey: 'howManyTeachedOrInterfering', translationKey: 'teachInterf', formatter: FORMATTERS.number },
        { paramKey: 'howManyDiscussingLessons', translationKey: 'discuss', formatter: FORMATTERS.number },
        { paramKey: 'wasKamal', translationKey: 'kamal', formatter: FORMATTERS.boolean },
        { paramKey: 'howManyLessonsAbsence', translationKey: 'absence', formatter: FORMATTERS.number },
      ],
      preValidation: async () => {
        await this.validateNoMoreThanTenAbsences();
        await this.validateSeminarKitaLessonCount();
      },
    },
    [TeacherTypeId.TRAINING]: {
      textKey: '',
      fields: [],
    },
    [TeacherTypeId.MANHA]: {
      textKey: 'REPORT.VALIDATION_CONFIRM_MANHA',
      fields: [
        {
          paramKey: 'teacherToReportFor',
          translationKey: 'teacherName',
          formatter: () => this.teacherToReportFor?.name || 'מורה',
        },
        { paramKey: 'howManyMethodic', translationKey: 'methodic', formatter: FORMATTERS.number },
        { paramKey: 'isTaarifHulia', translationKey: 'hulia1', formatter: FORMATTERS.number },
        { paramKey: 'isTaarifHulia2', translationKey: 'hulia2', formatter: FORMATTERS.number },
        { paramKey: 'isTaarifHulia3', translationKey: 'hulia3', formatter: FORMATTERS.number },
        { paramKey: 'howManyWatchedLessons', translationKey: 'watch', formatter: FORMATTERS.number },
        { paramKey: 'howManyStudentsTeached', translationKey: 'teach', formatter: FORMATTERS.number },
        { paramKey: 'howManyYalkutLessons', translationKey: 'yalkut', formatter: FORMATTERS.number },
        { paramKey: 'howManyStudentsHelpTeached', translationKey: 'help', formatter: FORMATTERS.number },
      ],
    },
    [TeacherTypeId.RESPONSIBLE]: {
      textKey: '',
      fields: [],
    },
    [TeacherTypeId.PDS]: {
      textKey: 'REPORT.VALIDATION_CONFIRM_PDS',
      fields: [
        { paramKey: 'howManyWatchOrIndividual', translationKey: 'watchIndiv', formatter: FORMATTERS.number },
        { paramKey: 'howManyTeachedOrInterfering', translationKey: 'teachInterf', formatter: FORMATTERS.number },
        { paramKey: 'howManyDiscussingLessons', translationKey: 'discuss', formatter: FORMATTERS.number },
      ],
    },
    [TeacherTypeId.KINDERGARTEN]: {
      textKey: 'REPORT.VALIDATION_CONFIRM_KINDERGARTEN',
      fields: [
        { paramKey: 'wasCollectiveWatch', translationKey: 'collective', formatter: FORMATTERS.boolean },
        { paramKey: 'howManyStudents', translationKey: 'students', formatter: FORMATTERS.number },
        { paramKey: 'wasStudentsGood', translationKey: 'studentsGood', formatter: FORMATTERS.boolean },
      ],
    },
    [TeacherTypeId.SPECIAL_EDUCATION]: {
      textKey: 'REPORT.VALIDATION_CONFIRM_SPECIAL_EDUCATION',
      fields: [
        { paramKey: 'howManyLessons', translationKey: 'lessons', formatter: FORMATTERS.number },
        { paramKey: 'howManyStudentsWatched', translationKey: 'studentsWatched', formatter: FORMATTERS.number },
        { paramKey: 'howManyStudentsTeached', translationKey: 'studentsTeached', formatter: FORMATTERS.number },
        { paramKey: 'wasPhoneDiscussing', translationKey: 'phoneDiscuss', formatter: FORMATTERS.boolean },
        { paramKey: 'whatIsYourSpeciality', translationKey: 'speciality', formatter: FORMATTERS.string },
      ],
    },
  };

  override async processCall(): Promise<void> {
    this.logger.log(`Processing call with ID: ${this.call.callId}`);
    await this.getUserByDidPhone();

    if (this.user.additionalData?.maintainanceMessage) {
      return this.hangupWithMessage(this.user.additionalData.maintainanceMessage);
    }

    this.teacher = await this.getTeacherByUserIdAndPhone();
    if (!this.teacher) {
      return this.hangupWithMessage(await this.getTextByUserId('TEACHER.PHONE_NOT_RECOGNIZED'));
    }

    // Get teacher type name
    let teacherTypeName = 'מורה';
    if (this.teacher.teacherTypeReferenceId) {
      const teacherType = await this.dataSource.getRepository(TeacherType).findOne({
        where: { userId: this.user.id, id: this.teacher.teacherTypeReferenceId },
      });
      if (teacherType) {
        teacherTypeName = teacherType.name;
      }
    }

    const welcomeMessage = await this.getTextByUserId('TEACHER.WELCOME', {
      teacherTypeName,
      name: this.teacher.name,
    });
    this.sendMessage(welcomeMessage);

    await this.askForReportDataAndSave();
  }

  private async getTeacherByUserIdAndPhone(): Promise<Teacher | null> {
    this.logger.log(`Getting teacher by user ID: ${this.user.id} and phone: ${this.call.ApiPhone}`);
    const teacher = await this.dataSource.getRepository(Teacher).findOne({
      where: {
        userId: this.user.id,
        phone: this.call.ApiPhone,
      },
      relations: ['teacherType'],
    });

    if (!teacher) {
      this.logger.log(`No teacher found with phone: ${this.call.ApiPhone}`);
    }

    return teacher;
  }

  private async askForReportDataAndSave(): Promise<void> {
    await this.askQuestions();
    await this.getReportDate();
    await this.getReportAndSave();
  }

  private async askQuestions(): Promise<void> {
    // Check if questions have already been answered
    if (this.callParams.questionAnswer) {
      return;
    }

    this.logger.log(`Asking questions for teacher type: ${this.teacher.teacherTypeReferenceId}`);

    const teacherQuestions = await this.getQuestionsForTeacher();
    for (const teacherQuestion of teacherQuestions) {
      let isValidAnswer = false;
      let answer: string;

      // Keep asking until we get a valid answer or skip
      while (!isValidAnswer) {
        // Build question message with skip instruction for optional questions
        const messageParts = [teacherQuestion.question.content];

        if (!teacherQuestion.question.isMandatory) {
          const skipInstruction = await this.getTextByUserId('QUESTION.SKIP_INSTRUCTION');
          messageParts.push(skipInstruction);
        }

        answer = await this.askForInput(messageParts.join(', '), {
          max_digits: 2,
          min_digits: 1,
        });

        // Check if teacher pressed * to skip
        if (answer === '*') {
          if (teacherQuestion.question.isMandatory) {
            // Cannot skip mandatory questions
            await this.sendMessage(await this.getTextByUserId('QUESTION.CANNOT_SKIP_MANDATORY'));
            // Loop continues to re-ask
          } else {
            // Skip optional question - don't save answer, move to next question
            this.logger.log(`Teacher skipped optional question: ${teacherQuestion.question.id}`);
            isValidAnswer = true; // Exit loop without saving
            answer = null; // Mark as skipped
          }
        } else {
          // Validate numeric answer is within range
          const numericAnswer = parseInt(answer);
          if (
            teacherQuestion.question.upperLimit !== null &&
            teacherQuestion.question.lowerLimit !== null &&
            (numericAnswer < teacherQuestion.question.lowerLimit || numericAnswer > teacherQuestion.question.upperLimit)
          ) {
            await this.sendMessage(await this.getTextByUserId('VALIDATION.OUT_OF_RANGE'));
            // Loop continues to re-ask
          } else {
            isValidAnswer = true;
          }
        }
      }

      // Only save answer if not skipped
      if (answer !== null) {
        // Save the answer first
        await this.saveAnswerForQuestion(teacherQuestion, answer);

        // Echo the question and answer back to the user
        await this.echoAnswerBack(teacherQuestion.question.content, answer);
      }
    }
  }

  private async echoAnswerBack(questionContent: string, answer: string): Promise<void> {
    // Echo back the question and answer to confirm
    const answerMessage = await this.getTextByUserId('QUESTION.ANSWER_ECHO', {
      questionText: questionContent,
      answer,
    });
    await this.sendMessage(answerMessage);
  }

  private async getQuestionsForTeacher(): Promise<TeacherQuestion[]> {
    const today = new Date();

    // Get individual assignments - include both unanswered and those with deleted answers
    // Using query builder to detect deleted answers via left join
    const individualAssignments = await this.dataSource
      .getRepository(TeacherQuestion)
      .createQueryBuilder('tq')
      .innerJoinAndSelect('tq.question', 'question')
      .leftJoin('tq.answer', 'answer')
      .where('tq.userId = :userId', { userId: this.user.id })
      .andWhere('tq.teacherReferenceId = :teacherId', { teacherId: this.teacher.id })
      .andWhere('question.startDate <= :today', { today })
      .andWhere('question.endDate >= :today', { today })
      .andWhere('(tq.answerReferenceId IS NULL OR answer.id IS NULL)')
      .getMany();

    return individualAssignments;
  }

  private async saveAnswerForQuestion(teacherQuestion: TeacherQuestion, answer: string): Promise<void> {
    const answerRepo = this.dataSource.getRepository(Answer);
    const answerEntity = answerRepo.create({
      userId: this.user.id,
      teacherTz: this.teacher.tz,
      questionReferenceId: teacherQuestion.question.id,
      answer: parseInt(answer),
      reportDate: teacherQuestion.question.effectiveDate || new Date(),
    });
    const savedAnswer = await answerRepo.save(answerEntity);

    // Link answer to teacher_question assignment if exists
    const teacherQuestionRepo = this.dataSource.getRepository(TeacherQuestion);
    await teacherQuestionRepo.update(teacherQuestion.id, {
      answerReferenceId: savedAnswer.id,
    });
  }

  private async getReportDate(): Promise<void> {
    if (this.reportDate) {
      return;
    }

    // Ask user to choose between new report or viewing previous reports
    const menuChoice = await this.askForInput(await this.getTextByUserId('REPORT.MAIN_MENU'), {
      max_digits: 1,
      min_digits: 1,
      digits_allowed: ['1', '3'],
    });

    if (menuChoice === '1') {
      // לתיקוף נוכחות - new report
      await this.getAndValidateReportDate();
    } else if (menuChoice === '3') {
      // לשמיעת דיווחים קודמים - show previous reports
      await this.showReports();
    } else {
      // Invalid choice, ask again
      return this.getReportDate();
    }
  }

  private async getAndValidateReportDate(): Promise<void> {
    // Always ask for date input instead of using today's date
    const dateInput = await this.askForInput(await this.getTextByUserId('REPORT.CHOOSE_DATE'), {
      max_digits: 8,
      min_digits: 8,
    });
    // Parse DD/MM/YYYY format - convert to Date
    const day = parseInt(dateInput.substr(0, 2));
    const month = parseInt(dateInput.substr(2, 2)) - 1; // JS months are 0-based
    const year = parseInt(dateInput.substr(4, 4));
    const reportDate = new Date(year, month, day);

    // Validate date
    if (isNaN(reportDate.getTime())) {
      this.sendMessage(await this.getTextByUserId('VALIDATION.INVALID_DATE'));
      return this.getAndValidateReportDate();
    }

    const reportDateIsFuture = reportDate > new Date();
    if (reportDateIsFuture) {
      this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_FUTURE'));
      return this.getAndValidateReportDate();
    }

    // Check if it's a working day
    const dateStr = reportDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const isWorkingDay = await this.validateWorkingDateForTeacher(dateStr);
    if (!isWorkingDay) {
      this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_NON_WORKING_DAY'));
      return this.getAndValidateReportDate();
    }

    // Check for existing reports
    if (this.teacher.teacherType?.key !== TeacherTypeId.MANHA) {
      // Not for "מורה מנחה"
      const existingReports = await this.getReportsByTeacherIdAndDate(dateStr);

      const relevantFields = [
        'howManyStudents',
        'howManyMethodic',
        'isTaarifHulia',
        'howManyWatchOrIndividual',
        'wasCollectiveWatch',
        'howManyLessons',
      ];
      this.existingReport = existingReports.find((report) =>
        relevantFields.some((field) => report[field] !== null && report[field] !== undefined),
      );

      if (this.existingReport) {
        if (this.existingReport.salaryReport) {
          this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_SALARY_REPORT'));
          return this.getAndValidateReportDate();
        }
        // if (this.existingReport.isConfirmed) {
        // all reports should be created as confirmed - so this block is redundant
        this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_CONFIRMED'));
        return this.getAndValidateReportDate();
        // }
        // this.sendMessage(await this.getTextByUserId('VALIDATION.EXISTING_REPORT_WILL_BE_DELETED'));
      }
    }

    // Hebrew date confirmation
    const hebrewDate = formatHebrewDateForIVR(reportDate);
    const isConfirmed = await this.askConfirmation('REPORT.CONFIRM_DATE', { date: hebrewDate });

    if (!isConfirmed) {
      return this.getAndValidateReportDate();
    }

    this.reportDate = dateStr;
  }

  private async validateWorkingDateForTeacher(date: string): Promise<boolean> {
    const workingDate = await this.dataSource.getRepository(WorkingDate).findOne({
      where: {
        userId: this.user.id,
        teacherTypeReferenceId: this.teacher.teacherTypeReferenceId,
        workingDate: new Date(date),
      },
    });
    return !!workingDate;
  }

  private async getReportsByTeacherIdAndDate(date: string): Promise<AttReport[]> {
    return await this.dataSource.getRepository(AttReport).find({
      where: {
        userId: this.user.id,
        teacherReferenceId: this.teacher.id,
        reportDate: new Date(date),
      },
    });
  }

  private async getReportAndSave(): Promise<void> {
    switch (this.teacher.teacherType?.key) {
      case TeacherTypeId.SEMINAR_KITA:
        // מורה של סמינר כיתה
        await this.getSeminarKitaReport();
        break;
      case TeacherTypeId.TRAINING:
        // מורה מאמנת - לא בשימוש
        await this.getTrainingReport();
        break;
      case TeacherTypeId.MANHA:
        // מורה מנחה
        await this.getManhaReport();
        break;
      case TeacherTypeId.RESPONSIBLE:
        // אחראית בית ספר - לא בשימוש
        await this.getReponsibleReport();
        break;
      case TeacherTypeId.PDS:
        // מורת פידיאס
        await this.getPdsReport();
        break;
      case TeacherTypeId.KINDERGARTEN:
        // גננות
        await this.getKindergartenReport();
        break;
      case TeacherTypeId.SPECIAL_EDUCATION:
        // חינוך מיוחד
        await this.getSpecialEducationReport();
        break;
      default:
        this.hangupWithMessage(await this.getTextByUserId('TEACHER.TYPE_NOT_RECOGNIZED'));
        break;
    }

    // Ask for confirmation after data collection
    await this.askForReportConfirmation();

    try {
      const attReport = {
        userId: this.user.id,
        teacherTz: this.teacher.tz,
        teacherReferenceId: this.teacher.id,
        reportDate: new Date(this.reportDate),
        updateDate: new Date(),
        year: getCurrentHebrewYear(),
        isConfirmed: true, // Always set to true - reports are confirmed on creation
        howManyMethodic: this.callParams.howManyMethodic ? parseInt(this.callParams.howManyMethodic) : null,
        fourLastDigitsOfTeacherPhone: this.callParams.fourLastDigitsOfTeacherPhone,
        isTaarifHulia: this.callParams.isTaarifHulia === '1',
        isTaarifHulia2: this.callParams.isTaarifHulia2 === '1',
        isTaarifHulia3: this.callParams.isTaarifHulia3 === '1',
        teachedStudentTz: this.callParams.teachedStudentTz,
        howManyYalkutLessons: this.callParams.howManyYalkutLessons
          ? parseInt(this.callParams.howManyYalkutLessons)
          : null,
        howManyDiscussingLessons: this.callParams.howManyDiscussingLessons
          ? parseInt(this.callParams.howManyDiscussingLessons)
          : null,
        howManyStudentsHelpTeached: this.callParams.howManyStudentsHelpTeached
          ? parseInt(this.callParams.howManyStudentsHelpTeached)
          : null,
        howManyLessonsAbsence: this.callParams.howManyLessonsAbsence
          ? parseInt(this.callParams.howManyLessonsAbsence)
          : null,
        howManyWatchedLessons: this.callParams.howManyWatchedLessons
          ? parseInt(this.callParams.howManyWatchedLessons)
          : null,
        wasDiscussing: this.callParams.wasDiscussing === '1',
        wasKamal: this.callParams.wasKamal === '1',
        wasStudentsGood: this.callParams.wasStudentsGood === '1',
        wasStudentsEnterOnTime: this.callParams.wasStudentsEnterOnTime === '1',
        wasStudentsExitOnTime: this.callParams.wasStudentsExitOnTime === '1',
        teacherToReportFor: this.callParams.teacherToReportFor ? parseInt(this.callParams.teacherToReportFor) : null,
        wasCollectiveWatch: this.callParams.wasCollectiveWatch === '1',
        howManyStudents: this.callParams.howManyStudents ? parseInt(this.callParams.howManyStudents) : null,
        howManyLessons: this.callParams.howManyLessons ? parseInt(this.callParams.howManyLessons) : null,
        howManyWatchOrIndividual: this.callParams.howManyWatchOrIndividual
          ? parseInt(this.callParams.howManyWatchOrIndividual)
          : null,
        howManyTeachedOrInterfering: this.callParams.howManyTeachedOrInterfering
          ? parseInt(this.callParams.howManyTeachedOrInterfering)
          : null,
        howManyStudentsTeached: this.callParams.howManyStudentsTeached
          ? parseInt(this.callParams.howManyStudentsTeached)
          : null,
        howManyStudentsWatched: this.callParams.howManyStudentsWatched
          ? parseInt(this.callParams.howManyStudentsWatched)
          : null,
        wasPhoneDiscussing: this.callParams.wasPhoneDiscussing === '1',
        whatIsYourSpeciality: this.callParams.whatIsYourSpeciality,
      };

      const attReportRepo = this.dataSource.getRepository(AttReport);
      const savedReport = await attReportRepo.save(attReport);

      if (this.existingReport) {
        await attReportRepo.remove(this.existingReport);
      }

      await this.finishSavingReport();
    } catch (error) {
      this.logger.error('Error saving report:', error);
      this.hangupWithMessage(await this.getTextByUserId('REPORT.DATA_NOT_SAVED'));
    }
  }

  private async getSeminarKitaReport(): Promise<void> {
    // TODO: Implement seminar kita report logic
    this.logger.log('Getting seminar kita report');

    // Use teacher's current student count if available, otherwise ask
    const currentStudentCount = await this.getCurrentStudentCount();
    this.callParams.howManyStudents = currentStudentCount?.toString();
    if (!this.callParams.howManyStudents) {
      // כמה תלמידות היו אצלך היום
      this.callParams.howManyStudents = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_SEMINAR_KITA'),
        { max_digits: 1, min_digits: 1 },
      );
    }

    // על כמה שיעורי סמינר כתה תרצי לדווח
    this.callParams.howManyLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_LESSONS_SEMINAR_KITA'),
      { max_digits: 1, min_digits: 1, digits_allowed: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    );

    // מתוכם כמה שיעורי צפיה או פרטני
    this.callParams.howManyWatchOrIndividual = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL'),
      { max_digits: 1, min_digits: 1 },
    );

    // כמה שיעורי מסירה או מעורבות
    this.callParams.howManyTeachedOrInterfering = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_TEACHED_OR_INTERFERING'),
      { max_digits: 1, min_digits: 1 },
    );

    // כמה שיעורי דיון
    this.callParams.howManyDiscussingLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_DISCUSSING_LESSONS'),
      { max_digits: 1, min_digits: 1, digits_allowed: ['0', '1'] },
    );

    // האם היה קמל?
    this.callParams.wasKamal = await this.askForInput(await this.getTextByUserId('REPORT.WAS_KAMAL'), {
      max_digits: 1,
      min_digits: 1,
    });

    // כמה שיעורים התלמידות חסרו מסיבות אישיות
    this.callParams.howManyLessonsAbsence = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_LESSONS_ABSENCE_SEMINAR_KITA'),
      { max_digits: 1, min_digits: 1 },
    );
  }

  private async getTrainingReport(): Promise<void> {
    // TODO: Implement training report logic (not in use)
    this.logger.log('Getting training report - not in use');
    throw new Error('Training report not implemented');
  }

  private async getManhaReport(): Promise<void> {
    // TODO: Implement manha report logic
    this.logger.log('Getting manha report');

    // if (!this.callParams.manhaReportType) {
    //   // האם מדווחת על עצמה או על מורות אחרות?
    //   this.callParams.manhaReportType = await this.askForInput(await this.getTextByUserId('REPORT.MANHA_REPORT_TYPE'), {
    //     max_digits: 1,
    //     min_digits: 1,
    //   });
    // }

    // if (this.callParams.manhaReportType === '1') {
    // מדווחת על עצמה - כמה שיעורי מתודיקה היו?
    this.callParams.howManyMethodic = await this.askForInput(await this.getTextByUserId('REPORT.HOW_MANY_METHODIC'), {
      max_digits: 1,
      min_digits: 1,
    });
    // } else {
    //   // מדווחת על מורות אחרות
    //   await this.getTeacherFourLastDigits();

    //   // כמה שיעורי צפיה בחוליה רגילה?
    //   this.callParams.isTaarifHulia = await this.askForInput(await this.getTextByUserId('REPORT.IS_TAARIF_HULIA'), {
    //     max_digits: 1,
    //     min_digits: 1,
    //   });

    //   // כמה שעורי צפיה בחוליה גדולה?
    //   this.callParams.isTaarifHulia2 = await this.askForInput(await this.getTextByUserId('REPORT.IS_TAARIF_HULIA2'), {
    //     max_digits: 1,
    //     min_digits: 1,
    //   });

    //   // כמה שיעורים היו בחוליה ה 2?
    //   this.callParams.isTaarifHulia3 = await this.askForInput(await this.getTextByUserId('REPORT.IS_TAARIF_HULIA3'), {
    //     max_digits: 1,
    //     min_digits: 1,
    //   });

    //   // כמה שיעורי צפיה?
    //   this.callParams.howManyWatchedLessons = await this.askForInput(
    //     await this.getTextByUserId('REPORT.HOW_MANY_WATCHED_LESSONS'),
    //     { max_digits: 1, min_digits: 1 },
    //   );

    //   // כמה בנות מסרו היום שיעור?
    //   this.callParams.howManyStudentsTeached = await this.askForInput(
    //     await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_TEACHED'),
    //     { max_digits: 1, min_digits: 1 },
    //   );

    //   // אם התשובה גדולה מ0 אז הקישי את מ.ז. של התלמידה - וחוזר על עצמו כמספר התלמידות שהמורה הקלידה שמסרו
    //   const numStudentsTeached = parseInt(this.callParams.howManyStudentsTeached);
    //   if (numStudentsTeached > 0) {
    //     for (let index = 0; index < numStudentsTeached; index++) {
    //       await this.getTeachedStudentTz(index + 1);
    //     }
    //   }

    //   // כמה שיעורי ילקוט הרועים?
    //   this.callParams.howManyYalkutLessons = await this.askForInput(
    //     await this.getTextByUserId('REPORT.HOW_MANY_YALKUT_LESSONS'),
    //     { max_digits: 1, min_digits: 1 },
    //   );

    //   // כמה שיעורי מרתון עזרת לתלמידות למסור?
    //   this.callParams.howManyStudentsHelpTeached = await this.askForInput(
    //     await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_HELP_TEACHED'),
    //     { max_digits: 1, min_digits: 1 },
    //   );
    // }
  }

  private async getReponsibleReport(): Promise<void> {
    // TODO: Implement responsible report logic (not in use)
    this.logger.log('Getting responsible report - not in use');
    throw new Error('Responsible report not implemented');
  }

  private async getPdsReport(): Promise<void> {
    // TODO: Implement PDS report logic
    this.logger.log('Getting PDS report');

    // כמה שיעורי צפיה או פרטני
    this.callParams.howManyWatchOrIndividual = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL'),
      { max_digits: 1, min_digits: 1 },
    );

    // כמה שיעורי מסירה או מעורבות
    this.callParams.howManyTeachedOrInterfering = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_TEACHED_OR_INTERFERING'),
      { max_digits: 1, min_digits: 1 },
    );

    // כמה שיעורי דיון
    this.callParams.howManyDiscussingLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_DISCUSSING_LESSONS'),
      { max_digits: 1, min_digits: 1, digits_allowed: ['0', '1'] },
    );
  }

  private async getKindergartenReport(): Promise<void> {
    // TODO: Implement kindergarten report logic
    this.logger.log('Getting kindergarten report');

    // האם הייתה צפיה קולקטיבית?
    this.callParams.wasCollectiveWatch = await this.askForInput(
      await this.getTextByUserId('REPORT.WAS_COLLECTIVE_WATCH'),
      { max_digits: 1, min_digits: 1 },
    );

    if (this.callParams.wasCollectiveWatch !== '1') {
      // כמה בנות היו בצפיה בגן?
      this.callParams.howManyStudents = await this.askForInput(await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS'), {
        max_digits: 1,
        min_digits: 1,
      });

      // האם תפקוד הבנות ענה על ציפיותיך?
      this.callParams.wasStudentsGood = await this.askForInput(await this.getTextByUserId('REPORT.WAS_STUDENTS_GOOD'), {
        max_digits: 1,
        min_digits: 1,
      });
    }
  }

  private async getSpecialEducationReport(): Promise<void> {
    // TODO: Implement special education report logic
    this.logger.log('Getting special education report');

    // כמה שיעורים היו?
    this.callParams.howManyLessons = await this.askForInput(await this.getTextByUserId('REPORT.HOW_MANY_LESSONS'), {
      max_digits: 1,
      min_digits: 1,
    });

    // כמה תלמידות צפו?
    this.callParams.howManyStudentsWatched = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_WATCHED'),
      { max_digits: 1, min_digits: 1 },
    );

    // כמה תלמידות מסרו?
    this.callParams.howManyStudentsTeached = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_TEACHED'),
      { max_digits: 1, min_digits: 1 },
    );

    // האם היה דיון טלפוני?
    this.callParams.wasPhoneDiscussing = await this.askForInput(
      await this.getTextByUserId('REPORT.WAS_PHONE_DISCUSSING'),
      { max_digits: 1, min_digits: 1 },
    );

    // מי המורה המנחה שלך?
    this.callParams.whoIsYourTrainingTeacher = await this.askForInput(
      await this.getTextByUserId('REPORT.WHO_IS_YOUR_TRAINING_TEACHER'),
      { max_digits: 1, min_digits: 1 },
    );

    // מה ההתמחות?
    this.callParams.whatIsYourSpeciality = await this.askForInput(
      await this.getTextByUserId('REPORT.WHAT_IS_YOUR_SPECIALITY'),
      { max_digits: 1, min_digits: 1 },
    );
  }

  private async getTeacherFourLastDigits(): Promise<void> {
    // הקישי 4 ספרות אחרונות של הטלפון של המורה
    const fourLastDigits = await this.askForInput(
      await this.getTextByUserId('REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE'),
      { max_digits: 4, min_digits: 4 },
    );

    const teachers = await this.getTeachersByFourLastDigits(fourLastDigits);

    if (teachers.length === 0) {
      this.sendMessage(await this.getTextByUserId('TEACHER.NO_TEACHER_FOUND_BY_DIGITS'));
      return this.getTeacherFourLastDigits();
    } else if (teachers.length > 1) {
      const teacherList = teachers.map((teacher, index) => `${teacher.name} ${index + 1}`).join(', ');
      const selection = await this.askForInput(
        await this.getTextByUserId('TEACHER.CONFIRM_TEACHER_MULTI', { teacherList }),
        { max_digits: 1, min_digits: 1 },
      );

      if (selection === '0') {
        return this.getTeacherFourLastDigits();
      }

      const selectedIndex = parseInt(selection) - 1;
      if (selectedIndex < 0 || selectedIndex >= teachers.length) {
        this.sendMessage(await this.getTextByUserId('GENERAL.INVALID_INPUT'));
        return this.getTeacherFourLastDigits();
      }

      this.teacherToReportFor = teachers[selectedIndex];
    } else {
      this.teacherToReportFor = teachers[0];
    }

    // Confirm teacher selection
    const confirmation = await this.askForInput(
      await this.getTextByUserId('TEACHER.CONFIRM_TEACHER_SINGLE', {
        teacherName: this.teacherToReportFor.name,
      }),
      { max_digits: 1, min_digits: 1 },
    );

    if (confirmation === '2') {
      return this.getTeacherFourLastDigits();
    }

    this.callParams.fourLastDigitsOfTeacherPhone = fourLastDigits;
  }

  private async getTeachersByFourLastDigits(fourLastDigits: string): Promise<Teacher[]> {
    return await this.dataSource.getRepository(Teacher).find({
      where: {
        userId: this.user.id,
        // Assuming phone field exists and we check last 4 digits
        phone: Like(`%${fourLastDigits}`),
      },
    });
  }

  private async getTeachedStudentTz(number: number): Promise<void> {
    // הקישי את מ.ז. של התלמידה
    const studentTz = await this.askForInput(
      await this.getTextByUserId('STUDENT.TZ_PROMPT', { number: number.toString() }),
      { max_digits: 9, min_digits: 9 },
    );

    const student = await this.getStudentByTz(studentTz);
    if (!student) {
      this.sendMessage(await this.getTextByUserId('STUDENT.NOT_FOUND'));
      return this.getTeachedStudentTz(number);
    }

    const confirmation = await this.askForInput(
      await this.getTextByUserId('STUDENT.CONFIRM', { studentName: student.name }),
      { max_digits: 1, min_digits: 1 },
    );

    if (confirmation === '2') {
      return this.getTeachedStudentTz(number);
    }

    // Add to the TZ collection
    this.callParams.teachedStudentTz = (this.callParams.teachedStudentTz || '') + studentTz + ',';
  }

  private async getStudentByTz(tz: string): Promise<any | null> {
    // TODO: Implement student lookup by TZ
    // This would require Student entity from shared module
    return null;
  }

  /**
   * Build confirmation parameters from callParams based on configuration
   */
  private buildConfirmationParams(fields: ConfirmationField[]): Record<string, string> {
    const params: Record<string, string> = {};

    for (const field of fields) {
      const value = this.callParams[field.paramKey];
      params[field.translationKey] = field.formatter(value, this);
    }

    return params;
  }

  /**
   * Generic method to ask for report confirmation
   * Uses this.teacher.teacherType.key to get the appropriate configuration
   */
  private async askForReportConfirmation(): Promise<void> {
    const confirmationConfig = this.CONFIRMATION_CONFIGS[this.teacher.teacherType?.key];

    if (!confirmationConfig || !confirmationConfig.textKey) {
      // No confirmation configured for this teacher type (e.g., TRAINING, RESPONSIBLE)
      return;
    }

    // Run pre-validation if configured
    if (confirmationConfig.preValidation) {
      await confirmationConfig.preValidation();
    }

    // Build the params object from callParams
    const params = this.buildConfirmationParams(confirmationConfig.fields);

    // Ask for confirmation using askConfirmation helper
    const isConfirmed = await this.askConfirmation(confirmationConfig.textKey, params);

    if (!isConfirmed) {
      // Reset collected data to prevent stale conditional fields
      this.callParams = {};
      this.teacherToReportFor = null; // Also reset for Manha teachers
      // Go back to start of data collection (keeps reportDate, existingReport, teacher, user)
      return this.getReportAndSave();
    }
  }

  private async finishSavingReport(): Promise<void> {
    const isManhaAndOnOthers =
      this.teacher.teacherType?.key === TeacherTypeId.MANHA && this.callParams.manhaReportType === '2';
    const isSeminarKita = this.teacher.teacherType?.key === TeacherTypeId.SEMINAR_KITA;

    if (isManhaAndOnOthers) {
      // בסיום האם תרצי לדווח על מורה נוספת
      this.sendMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
      const anotherTeacherReport = await this.askForInput(await this.getTextByUserId('REPORT.ANOTHER_TEACHER_REPORT'), {
        max_digits: 1,
        min_digits: 1,
      });

      if (anotherTeacherReport === '1') {
        return this.askForReportDataAndSave();
      } else {
        this.hangupWithMessage(await this.getTextByUserId('REPORT.GOODBYE_TO_MANHA_TEACHER'));
      }
    } else if (isSeminarKita) {
      // האם תרצי לדווח על יום נוסף
      this.sendMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
      const anotherDateReport = await this.askForInput(await this.getTextByUserId('REPORT.ANOTHER_DATE_REPORT'), {
        max_digits: 1,
        min_digits: 1,
      });

      if (anotherDateReport === '1') {
        this.reportDate = null; // Reset report date
        // Skip main menu, go directly to date selection and then report collection
        await this.getAndValidateReportDate();
        return this.getReportAndSave();
      } else {
        this.hangupWithMessage(await this.getTextByUserId('REPORT.GOODBYE_TO_MANHA_TEACHER'));
      }
    } else {
      this.hangupWithMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
    }
  }

  private async showReports(): Promise<void> {
    this.logger.log('Showing reports');

    const reportsMonth = await this.askForInput(await this.getTextByUserId('REPORT.CHOOSE_REPORTS_MONTH'), {
      max_digits: 2,
      min_digits: 1,
    });

    const month = Number(reportsMonth);
    let year = new Date().getFullYear();
    if (month > new Date().getMonth() + 1) {
      year -= 1;
    }

    const startDate = new Date(year, month - 1, 1); // month is 0-based in JS
    const endDate = new Date(year, month, 0); // last day of month

    const reports = await this.getAllReportsByDateRange(startDate, endDate);

    if (reports.length === 0) {
      this.hangupWithMessage(await this.getTextByUserId('REPORT.NO_REPORT_FOUND'));
    } else {
      for (const report of reports) {
        // Just read the report message, no user interaction
        const message = await this.getReportMessage(report);
        this.sendMessage(message);
      }
      // After reading all reports, hangup
      this.hangupWithMessage(await this.getTextByUserId('REPORT.GOODBYE_TO_MANHA_TEACHER'));
    }
  }

  private async getAllReportsByDateRange(startDate: Date, endDate: Date): Promise<AttReport[]> {
    return await this.dataSource.getRepository(AttReport).find({
      where: {
        userId: this.user.id,
        teacherReferenceId: this.teacher.id,
        reportDate: Between(startDate, endDate),
      },
      order: {
        reportDate: 'ASC',
      },
    });
  }

  private async getReportMessage(report: AttReport): Promise<string> {
    const reportDate = formatHebrewDateForIVR(report.reportDate);

    const reportMessages: Record<TeacherTypeId, string> = {
      [TeacherTypeId.SEMINAR_KITA]: 'REPORT.SEMINAR_KITA_PREVIOUS',
      [TeacherTypeId.TRAINING]: '',
      [TeacherTypeId.MANHA]: 'REPORT.MANHA_PREVIOUS',
      [TeacherTypeId.RESPONSIBLE]: '',
      [TeacherTypeId.PDS]: 'REPORT.PDS_PREVIOUS',
      [TeacherTypeId.KINDERGARTEN]: 'REPORT.KINDERGARTEN_PREVIOUS',
      [TeacherTypeId.SPECIAL_EDUCATION]: 'REPORT.SPECIAL_EDUCATION_PREVIOUS',
    };

    const messageKey = reportMessages[this.teacher.teacherType?.key];
    if (!messageKey) {
      return `דיווח מתאריך ${reportDate}`;
    }

    const params = {
      date: reportDate,
      lessons: report.howManyLessons?.toString() || '0',
      watchIndiv: report.howManyWatchOrIndividual?.toString() || '0',
      teachInterf: report.howManyTeachedOrInterfering?.toString() || '0',
      discuss: report.howManyDiscussingLessons?.toString() || '0',
      absence: report.howManyLessonsAbsence?.toString() || '0',
      kamal: report.wasKamal ? '1' : '0',
      students: report.howManyStudents?.toString() || '0',
      methodic: report.howManyMethodic?.toString() || '0',
      phone: report.fourLastDigitsOfTeacherPhone || '',
      hulia1: report.isTaarifHulia ? '1' : '0',
      hulia2: report.isTaarifHulia2 ? '1' : '0',
      watch: report.howManyWatchedLessons?.toString() || '0',
      teach: report.howManyStudentsTeached?.toString() || '0',
      studentTz: report.teachedStudentTz || '',
      yalkut: report.howManyYalkutLessons?.toString() || '0',
      help: report.howManyStudentsHelpTeached?.toString() || '0',
      hulia3: report.isTaarifHulia3 ? '1' : '0',
      studentsWatched: report.howManyStudentsWatched?.toString() || '0',
      studentsTeached: report.howManyStudentsTeached?.toString() || '0',
      phoneDiscuss: report.wasPhoneDiscussing ? '1' : '0',
      trainingTeacher: report.teacherToReportFor?.toString() || '',
      speciality: report.whatIsYourSpeciality?.toString() || '',
      studentsGood: report.wasStudentsGood ? '1' : '0',
      enterOnTime: report.wasStudentsEnterOnTime ? '1' : '0',
      exitOnTime: report.wasStudentsExitOnTime ? '1' : '0',
      collective: report.wasCollectiveWatch ? '1' : '0',
    };

    return await this.getTextByUserId(messageKey, params);
  }

  private async validateNoMoreThanTenAbsences(): Promise<void> {
    // לא לאפשר יותר מ 10 חיסורים
    const existingAbsences = await this.getAbsencesCountForTeacher();
    const newAbsences = parseInt(this.callParams.howManyLessonsAbsence || '0');
    const existingReportAbsences = this.existingReport?.howManyLessonsAbsence || 0;

    if (existingAbsences + newAbsences - existingReportAbsences > 10) {
      // יותר מ-10 חיסורים - נותן למורה הזדמנות להקליד שוב
      this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_MORE_THAN_TEN_ABSENCES'));

      // קוראים לפונקציה שוב מההתחלה
      return this.getSeminarKitaReport();
    }
  }

  private async validateSeminarKitaLessonCount(): Promise<void> {
    // סה"כ שיעורים שמורה מדווחת בפועל צריך להיות תואם למספר שהקישה שרוצה לדווח
    const totalCount = parseInt(this.callParams.howManyLessons || '0');
    const reportedCount =
      parseInt(this.callParams.howManyWatchOrIndividual || '0') +
      parseInt(this.callParams.howManyTeachedOrInterfering || '0') +
      parseInt(this.callParams.wasKamal || '0') +
      parseInt(this.callParams.howManyDiscussingLessons || '0') +
      parseInt(this.callParams.howManyLessonsAbsence || '0');

    if (totalCount !== reportedCount) {
      // המספר לא תואם - נותן למורה הזדמנות להקליד שוב
      this.sendMessage(await this.getTextByUserId('VALIDATION.SEMINAR_KITA_LESSON_COUNT'));

      // קוראים לפונקציה שוב מההתחלה
      return this.getSeminarKitaReport();
    }
  }

  private async getAbsencesCountForTeacher(): Promise<number> {
    const reports = await this.dataSource.getRepository(AttReport).find({
      where: {
        userId: this.user.id,
        teacherReferenceId: this.teacher.id,
      },
      select: ['howManyLessonsAbsence'],
    });

    return reports.reduce((total, report) => total + (report.howManyLessonsAbsence || 0), 0);
  }

  private async getCurrentStudentCount(): Promise<number> {
    if (!this.teacher) {
      return 0;
    }

    const today = new Date();
    const studentRepository = this.dataSource.getRepository(Student);

    const count = await studentRepository
      .createQueryBuilder('student')
      .where('student.userId = :userId', { userId: this.user.id })
      .andWhere('student.teacherReferenceId = :teacherId', { teacherId: this.teacher.id })
      .andWhere('(student.startDate IS NULL OR student.startDate <= :today)', { today })
      .andWhere('(student.endDate IS NULL OR student.endDate >= :today)', { today })
      .getCount();

    return count;
  }
}
