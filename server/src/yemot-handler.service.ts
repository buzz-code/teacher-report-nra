import { Injectable } from '@nestjs/common';
import { BaseYemotHandlerService } from '../shared/utils/yemot/v2/yemot-router.service';
import { Teacher } from 'src/db/entities/Teacher.entity';
import { TeacherType } from 'src/db/entities/TeacherType.entity';
import { AttReport } from 'src/db/entities/AttReport.entity';
import { Question } from 'src/db/entities/Question.entity';
import { Answer } from 'src/db/entities/Answer.entity';
import { WorkingDate } from 'src/db/entities/WorkingDate.entity';
import { getCurrentHebrewYear } from '@shared/utils/entity/year.util';
import {
  formatHebrewDateForIVR,
  gematriyaLetters,
  getGregorianDateFromHebrew,
  getHebrewMonthsList,
} from '@shared/utils/formatting/hebrew.util';
import { Class } from 'src/db/entities/Class.entity';
import { StudentClass } from 'src/db/entities/StudentClass.entity';
import { Student } from 'src/db/entities/Student.entity';
import { Event } from 'src/db/entities/Event.entity';

@Injectable()
export class YemotHandlerService extends BaseYemotHandlerService {
  private teacher: Teacher;
  private existingReport: AttReport;
  private reportDate: string;
  private callParams: any = {}; // Store call parameters

  override async processCall(): Promise<void> {
    this.logger.log(`Processing call with ID: ${this.call.callId}`);
    await this.getUserByDidPhone();

    if (this.user.additionalData?.maintainanceMessage) {
      return this.hangupWithMessage(this.user.additionalData.maintainanceMessage);
    }

    // TODO: should student enter with 99999, or type it here?
    if (this.call.ApiEnterID && this.call.ApiEnterID.includes('999999')) {
      this.logger.log(`User requested to listen to class celebrations`);
      return this.processClassCelebrationsListener();
    }

    this.teacher = await this.getTeacherByUserIdAndPhone();
    if (!this.teacher) {
      return this.hangupWithMessage(await this.getTextByUserId('TEACHER.PHONE_NOT_RECOGNIZED'));
    }

    const welcomeMessage = await this.getTextByUserId('TEACHER.WELCOME', { 
      teacherTypeName: this.teacher.teacherTypeId ? `מורה ${this.teacher.teacherTypeId}` : 'מורה',
      name: this.teacher.name 
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

    // TODO: Implement question handling - get questions based on teacher type
    this.logger.log(`Asking questions for teacher type: ${this.teacher.teacherTypeId}`);
    
    const questions = await this.getQuestionsForTeacher();
    for (const question of questions) {
      const messages = [question.content];
      if (!question.allowedDigits) {
        messages.push(await this.getTextByUserId('QUESTION.CHOOSE_ANSWER'));
      }

      const answer = await this.askForInput(messages.join(','), {
        max_digits: 1,
        min_digits: 1,
        digits_allowed: question.allowedDigits?.split(',') || ['0', '1'],
      });

      await this.saveAnswerForQuestion(question.id, answer);

      if (question.isStandalone) {
        await this.createEmptyReportForAnswers();
        return this.hangupWithMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
      }
    }
  }

  private async getQuestionsForTeacher(): Promise<Question[]> {
    // TODO: Implement proper question filtering based on teacher type and special question
    return await this.dataSource.getRepository(Question).find({
      where: {
        userId: this.user.id,
        teacherTypeId: this.teacher.teacherTypeId,
      },
    });
  }

  private async saveAnswerForQuestion(questionId: number, answer: string): Promise<void> {
    const answerRepo = this.dataSource.getRepository(Answer);
    const answerEntity = answerRepo.create({
      userId: this.user.id,
      teacherId: this.teacher.id,
      questionId: questionId,
      answer: parseInt(answer),
      answerDate: new Date(),
    });
    await answerRepo.save(answerEntity);
  }

  private async getReportDate(): Promise<void> {
    if (this.reportDate) {
      return;
    }

    const reportDateType = await this.askForInput(
      await this.getTextByUserId('REPORT.CHOOSE_DATE_TYPE'),
      {
        max_digits: 1,
        min_digits: 1,
        digits_allowed: ['1', '2', '3'],
      }
    );

    if (reportDateType === '1') {
      await this.getAndValidateReportDate(true);
    } else if (reportDateType === '2') {
      await this.getAndValidateReportDate(false);
    } else if (reportDateType === '3') {
      await this.showReports();
    } else {
      this.hangupWithMessage(await this.getTextByUserId('GENERAL.INVALID_INPUT'));
    }
  }

  private async getAndValidateReportDate(isToday: boolean): Promise<void> {
    let reportDate: Date;

    if (!isToday) {
      const dateInput = await this.askForInput(
        await this.getTextByUserId('REPORT.CHOOSE_DATE'),
        {
          max_digits: 8,
          min_digits: 8,
        }
      );
      // Parse DD/MM/YYYY format - convert to Date
      const day = parseInt(dateInput.substr(0, 2));
      const month = parseInt(dateInput.substr(2, 2)) - 1; // JS months are 0-based
      const year = parseInt(dateInput.substr(4, 4));
      reportDate = new Date(year, month, day);
    } else {
      reportDate = new Date();
    }

    // Validate date
    if (isNaN(reportDate.getTime())) {
      this.sendMessage(await this.getTextByUserId('VALIDATION.INVALID_DATE'));
      return this.getAndValidateReportDate(isToday);
    }

    const reportDateIsFuture = reportDate > new Date();
    if (reportDateIsFuture) {
      this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_FUTURE'));
      return this.getAndValidateReportDate(isToday);
    }

    // Check if it's a working day
    const dateStr = reportDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const isWorkingDay = await this.validateWorkingDateForTeacher(dateStr);
    if (!isWorkingDay) {
      this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_NON_WORKING_DAY'));
      return this.getAndValidateReportDate(isToday);
    }

    // Check for existing reports
    if (this.teacher.teacherTypeId !== 3) { // Not for "מורה מנחה"
      const existingReports = await this.getReportsByTeacherIdAndDate(dateStr);
      
      const relevantFields = ['howManyStudents', 'howManyMethodic', 'isTaarifHulia', 'howManyWatchOrIndividual', 'wasCollectiveWatch', 'howManyLessons'];
      this.existingReport = existingReports.find(report => 
        relevantFields.some(field => report[field] !== null && report[field] !== undefined)
      );

      if (this.existingReport) {
        if (this.existingReport.salaryReport) {
          this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_SALARY_REPORT'));
          return this.getAndValidateReportDate(isToday);
        }
        if (this.existingReport.isConfirmed) {
          this.sendMessage(await this.getTextByUserId('VALIDATION.CANNOT_REPORT_CONFIRMED'));
          return this.getAndValidateReportDate(isToday);
        }
        this.sendMessage(await this.getTextByUserId('VALIDATION.EXISTING_REPORT_WILL_BE_DELETED'));
      }
    }

    // Hebrew date confirmation
    const hebrewDate = formatHebrewDateForIVR(reportDate);
    const isConfirmed = await this.askConfirmation('REPORT.CONFIRM_DATE', { date: hebrewDate });
    
    if (!isConfirmed) {
      return this.getAndValidateReportDate(isToday);
    }

    this.reportDate = dateStr;
  }

  private async validateWorkingDateForTeacher(date: string): Promise<boolean> {
    const workingDate = await this.dataSource.getRepository(WorkingDate).findOne({
      where: {
        userId: this.user.id,
        teacherTypeId: this.teacher.teacherTypeId,
        workingDate: new Date(date),
      },
    });
    return !!workingDate;
  }

  private async getReportsByTeacherIdAndDate(date: string): Promise<AttReport[]> {
    return await this.dataSource.getRepository(AttReport).find({
      where: {
        userId: this.user.id,
        teacherId: this.teacher.id,
        reportDate: new Date(date),
      },
    });
  }

  private async getReportAndSave(): Promise<void> {
    switch (this.teacher.teacherTypeId) {
      case 1:
        // מורה של סמינר כיתה
        await this.getSeminarKitaReport();
        break;
      case 2:
        // מורה מאמנת - לא בשימוש
        await this.getTrainingReport();
        break;
      case 3:
        // מורה מנחה
        await this.getManhaReport();
        break;
      case 4:
        // אחראית בית ספר - לא בשימוש
        await this.getReponsibleReport();
        break;
      case 5:
        // מורת פידיאס
        await this.getPdsReport();
        break;
      case 6:
        // גננות
        await this.getKindergartenReport();
        break;
      case 7:
        // חינוך מיוחד
        await this.getSpecialEducationReport();
        break;
      default:
        this.hangupWithMessage(await this.getTextByUserId('TEACHER.TYPE_NOT_RECOGNIZED'));
        break;
    }

    try {
      const attReport = {
        userId: this.user.id,
        teacherId: this.teacher.id,
        reportDate: new Date(this.reportDate),
        updateDate: new Date(),
        year: getCurrentHebrewYear(),
        howManyMethodic: this.callParams.howManyMethodic ? parseInt(this.callParams.howManyMethodic) : null,
        fourLastDigitsOfTeacherPhone: this.callParams.fourLastDigitsOfTeacherPhone,
        isTaarifHulia: this.callParams.isTaarifHulia === '1',
        isTaarifHulia2: this.callParams.isTaarifHulia2 === '1',
        isTaarifHulia3: this.callParams.isTaarifHulia3 === '1',
        teachedStudentTz: this.callParams.teachedStudentTz,
        howManyYalkutLessons: this.callParams.howManyYalkutLessons ? parseInt(this.callParams.howManyYalkutLessons) : null,
        howManyDiscussingLessons: this.callParams.howManyDiscussingLessons ? parseInt(this.callParams.howManyDiscussingLessons) : null,
        howManyStudentsHelpTeached: this.callParams.howManyStudentsHelpTeached ? parseInt(this.callParams.howManyStudentsHelpTeached) : null,
        howManyLessonsAbsence: this.callParams.howManyLessonsAbsence ? parseInt(this.callParams.howManyLessonsAbsence) : null,
        howManyWatchedLessons: this.callParams.howManyWatchedLessons ? parseInt(this.callParams.howManyWatchedLessons) : null,
        wasDiscussing: this.callParams.wasDiscussing === '1',
        wasKamal: this.callParams.wasKamal === '1',
        wasStudentsGood: this.callParams.wasStudentsGood === '1',
        wasStudentsEnterOnTime: this.callParams.wasStudentsEnterOnTime === '1',
        wasStudentsExitOnTime: this.callParams.wasStudentsExitOnTime === '1',
        teacherToReportFor: this.callParams.teacherToReportFor ? parseInt(this.callParams.teacherToReportFor) : null,
        wasCollectiveWatch: this.callParams.wasCollectiveWatch === '1',
        howManyStudents: this.callParams.howManyStudents ? parseInt(this.callParams.howManyStudents) : null,
        howManyLessons: this.callParams.howManyLessons ? parseInt(this.callParams.howManyLessons) : null,
      };

      const attReportRepo = this.dataSource.getRepository(AttReport);
      const savedReport = await attReportRepo.save(attReport);
      
      if (this.existingReport) {
        await attReportRepo.remove(this.existingReport);
        await this.updateReportIdForExistingReportAnswers(this.existingReport.id, savedReport.id);
      }

      await this.updateReportIdForAnswers(savedReport.id);

      await this.finishSavingReport();
    } catch (error) {
      this.logger.error('Error saving report:', error);
      this.hangupWithMessage(await this.getTextByUserId('REPORT.DATA_NOT_SAVED'));
    }
  }

  private async getSeminarKitaReport(): Promise<void> {
    // TODO: Implement seminar kita report logic
    this.logger.log('Getting seminar kita report');
    
    // כמה תלמידות היו אצלך היום
    if (!this.callParams.howManyStudents) {
      this.callParams.howManyStudents = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_SEMINAR_KITA'),
        { max_digits: 1, min_digits: 1 }
      );
    }

    // על כמה שיעורי סמינר כתה תרצי לדווח
    this.callParams.howManyLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_LESSONS_SEMINAR_KITA'),
      { max_digits: 1, min_digits: 1, digits_allowed: ['1', '2', '3', '4', '5', '6', '7', '8'] }
    );

    // מתוכם כמה שיעורי צפיה או פרטני
    this.callParams.howManyWatchOrIndividual = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL'),
      { max_digits: 1, min_digits: 1 }
    );

    // כמה שיעורי מסירה או מעורבות
    this.callParams.howManyTeachedOrInterfering = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_TEACHED_OR_INTERFERING'),
      { max_digits: 1, min_digits: 1 }
    );

    // האם היה קמל?
    this.callParams.wasKamal = await this.askForInput(
      await this.getTextByUserId('REPORT.WAS_KAMAL'),
      { max_digits: 1, min_digits: 1 }
    );

    // כמה שיעורי דיון
    this.callParams.howManyDiscussingLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_DISCUSSING_LESSONS'),
      { max_digits: 1, min_digits: 1, digits_allowed: ['0', '1'] }
    );

    // כמה שיעורים התלמידות חסרו מסיבות אישיות
    this.callParams.howManyLessonsAbsence = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_LESSONS_ABSENCE_SEMINAR_KITA'),
      { max_digits: 1, min_digits: 1 }
    );

    // TODO: Add validation methods
    // await this.validateNoMoreThanTenAbsences();
    // await this.validateSeminarKitaLessonCount();
  }

  private async getTrainingReport(): Promise<void> {
    // TODO: Implement training report logic (not in use)
    this.logger.log('Getting training report - not in use');
  }

  private async getManhaReport(): Promise<void> {
    // TODO: Implement manha report logic
    this.logger.log('Getting manha report');
    
    if (!this.callParams.manhaReportType) {
      // האם מדווחת על עצמה או על מורות אחרות?
      this.callParams.manhaReportType = await this.askForInput(
        await this.getTextByUserId('REPORT.MANHA_REPORT_TYPE'),
        { max_digits: 1, min_digits: 1 }
      );
    }
    
    if (this.callParams.manhaReportType === '1') {
      // מדווחת על עצמה - כמה שיעורי מתודיקה היו?
      this.callParams.howManyMethodic = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_METHODIC'),
        { max_digits: 1, min_digits: 1 }
      );
    } else {
      // מדווחת על מורות אחרות
      await this.getTeacherFourLastDigits();
      
      // כמה שיעורי צפיה בחוליה רגילה?
      this.callParams.isTaarifHulia = await this.askForInput(
        await this.getTextByUserId('REPORT.IS_TAARIF_HULIA'),
        { max_digits: 1, min_digits: 1 }
      );

      // כמה שעורי צפיה בחוליה גדולה?
      this.callParams.isTaarifHulia2 = await this.askForInput(
        await this.getTextByUserId('REPORT.IS_TAARIF_HULIA2'),
        { max_digits: 1, min_digits: 1 }
      );

      // כמה שיעורים היו בחוליה ה 2?
      this.callParams.isTaarifHulia3 = await this.askForInput(
        await this.getTextByUserId('REPORT.IS_TAARIF_HULIA3'),
        { max_digits: 1, min_digits: 1 }
      );

      // כמה שיעורי צפיה?
      this.callParams.howManyWatchedLessons = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_WATCHED_LESSONS'),
        { max_digits: 1, min_digits: 1 }
      );

      // כמה בנות מסרו היום שיעור?
      this.callParams.howManyStudentsTeached = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_TEACHED'),
        { max_digits: 1, min_digits: 1 }
      );

      // כמה שיעורי ילקוט הרועים?
      this.callParams.howManyYalkutLessons = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_YALKUT_LESSONS'),
        { max_digits: 1, min_digits: 1 }
      );

      // כמה שיעורי מרתון עזרת לתלמידות למסור?
      this.callParams.howManyStudentsHelpTeached = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_HELP_TEACHED'),
        { max_digits: 1, min_digits: 1 }
      );

      // TODO: Add validation method
      // await this.validateManhaReport();
    }
  }

  private async getReponsibleReport(): Promise<void> {
    // TODO: Implement responsible report logic (not in use)
    this.logger.log('Getting responsible report - not in use');
  }

  private async getPdsReport(): Promise<void> {
    // TODO: Implement PDS report logic
    this.logger.log('Getting PDS report');
    
    // כמה שיעורי צפיה או פרטני
    this.callParams.howManyWatchOrIndividual = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL'),
      { max_digits: 1, min_digits: 1 }
    );

    // כמה שיעורי מסירה או מעורבות
    this.callParams.howManyTeachedOrInterfering = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_TEACHED_OR_INTERFERING'),
      { max_digits: 1, min_digits: 1 }
    );

    // כמה שיעורי דיון
    this.callParams.howManyDiscussingLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_DISCUSSING_LESSONS'),
      { max_digits: 1, min_digits: 1, digits_allowed: ['0', '1'] }
    );

    // TODO: Add validation method
    // await this.validatePdsReport();
  }

  private async getKindergartenReport(): Promise<void> {
    // TODO: Implement kindergarten report logic
    this.logger.log('Getting kindergarten report');
    
    // האם הייתה צפיה קולקטיבית?
    this.callParams.wasCollectiveWatch = await this.askForInput(
      await this.getTextByUserId('REPORT.WAS_COLLECTIVE_WATCH'),
      { max_digits: 1, min_digits: 1 }
    );

    if (this.callParams.wasCollectiveWatch !== '1') {
      // כמה בנות היו בצפיה בגן?
      this.callParams.howManyStudents = await this.askForInput(
        await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS'),
        { max_digits: 1, min_digits: 1 }
      );

      // האם תפקוד הבנות ענה על ציפיותיך?
      this.callParams.wasStudentsGood = await this.askForInput(
        await this.getTextByUserId('REPORT.WAS_STUDENTS_GOOD'),
        { max_digits: 1, min_digits: 1 }
      );
    }
  }

  private async getSpecialEducationReport(): Promise<void> {
    // TODO: Implement special education report logic
    this.logger.log('Getting special education report');
    
    // כמה שיעורים היו?
    this.callParams.howManyLessons = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_LESSONS'),
      { max_digits: 1, min_digits: 1 }
    );

    // כמה תלמידות צפו?
    this.callParams.howManyStudentsWatched = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_WATCHED'),
      { max_digits: 1, min_digits: 1 }
    );

    // כמה תלמידות מסרו?
    this.callParams.howManyStudentsTeached = await this.askForInput(
      await this.getTextByUserId('REPORT.HOW_MANY_STUDENTS_TEACHED'),
      { max_digits: 1, min_digits: 1 }
    );

    // האם היה דיון טלפוני?
    this.callParams.wasPhoneDiscussing = await this.askForInput(
      await this.getTextByUserId('REPORT.WAS_PHONE_DISCUSSING'),
      { max_digits: 1, min_digits: 1 }
    );

    // מי המורה המנחה שלך?
    this.callParams.whoIsYourTrainingTeacher = await this.askForInput(
      await this.getTextByUserId('REPORT.WHO_IS_YOUR_TRAINING_TEACHER'),
      { max_digits: 1, min_digits: 1 }
    );

    // מה ההתמחות?
    this.callParams.whatIsYourSpeciality = await this.askForInput(
      await this.getTextByUserId('REPORT.WHAT_IS_YOUR_SPECIALITY'),
      { max_digits: 1, min_digits: 1 }
    );
  }

  private async getTeacherFourLastDigits(): Promise<void> {
    // TODO: Implement teacher selection by four last digits
    this.logger.log('Getting teacher four last digits');
    
    this.callParams.fourLastDigitsOfTeacherPhone = await this.askForInput(
      await this.getTextByUserId('REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE'),
      { max_digits: 4, min_digits: 4 }
    );

    // TODO: Add teacher validation and selection logic
    // const teachers = await this.getTeachersByFourLastDigits();
    // Handle teacher selection confirmation
  }

  private async finishSavingReport(): Promise<void> {
    const isManhaAndOnOthers = this.teacher.teacherTypeId === 3 && this.callParams.manhaReportType === '2';
    const isSeminarKita = this.teacher.teacherTypeId === 1;
    
    if (isManhaAndOnOthers) {
      // בסיום האם תרצי לדווח על מורה נוספת
      this.sendMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
      const anotherTeacherReport = await this.askForInput(
        await this.getTextByUserId('REPORT.ANOTHER_TEACHER_REPORT'),
        { max_digits: 1, min_digits: 1 }
      );
      
      if (anotherTeacherReport === '1') {
        return this.askForReportDataAndSave();
      } else {
        this.hangupWithMessage(await this.getTextByUserId('REPORT.GOODBYE_TO_MANHA_TEACHER'));
      }
    } else if (isSeminarKita) {
      // האם תרצי לדווח על יום נוסף
      this.sendMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
      const anotherDateReport = await this.askForInput(
        await this.getTextByUserId('REPORT.ANOTHER_DATE_REPORT'),
        { max_digits: 1, min_digits: 1 }
      );
      
      if (anotherDateReport === '1') {
        this.reportDate = null; // Reset report date
        return this.getAndValidateReportDate(false);
      } else {
        this.hangupWithMessage(await this.getTextByUserId('REPORT.GOODBYE_TO_MANHA_TEACHER'));
      }
    } else {
      this.hangupWithMessage(await this.getTextByUserId('REPORT.DATA_SAVED_SUCCESS'));
    }
  }

  private async showReports(): Promise<void> {
    // TODO: Implement show reports logic
    this.logger.log('Showing reports');
    
    const reportsMonth = await this.askForInput(
      await this.getTextByUserId('REPORT.CHOOSE_REPORTS_MONTH'),
      { max_digits: 2, min_digits: 1 }
    );

    const month = Number(reportsMonth);
    let year = new Date().getFullYear();
    if (month > new Date().getMonth() + 1) {
      year -= 1;
    }

    const startDate = new Date(year, month - 1, 1); // month is 0-based in JS
    const endDate = new Date(year, month, 0); // last day of month

    const previousReports = await this.getUnconfirmedReportsByDateRange(startDate, endDate);

    if (previousReports.length === 0) {
      this.hangupWithMessage(await this.getTextByUserId('REPORT.NO_REPORT_FOUND'));
    } else {
      for (const report of previousReports) {
        const reportConfirm = await this.askForInput(
          this.getReportMessage(report),
          { max_digits: 1, min_digits: 1 }
        );

        if (reportConfirm === '9') {
          await this.saveReportAsConfirmed(report.id);
        } else {
          this.existingReport = report;
          this.reportDate = report.reportDate.toISOString().split('T')[0]; // YYYY-MM-DD format
          return this.getReportAndSave();
        }
      }
    }

    this.hangupWithMessage(await this.getTextByUserId('REPORT.GOODBYE_TO_MANHA_TEACHER'));
  }

  private async createEmptyReportForAnswers(): Promise<void> {
    const emptyReport = {
      userId: this.user.id,
      teacherId: this.teacher.id,
      reportDate: new Date(),
      updateDate: new Date(),
      year: getCurrentHebrewYear(),
      isConfirmed: true,
    };
    const attReportRepo = this.dataSource.getRepository(AttReport);
    const savedReport = await attReportRepo.save(emptyReport);
    await this.updateReportIdForAnswers(savedReport.id);
  }

  private async updateReportIdForAnswers(reportId: number): Promise<void> {
    await this.dataSource.getRepository(Answer).update(
      { userId: this.user.id, teacherId: this.teacher.id, reportId: null },
      { reportId: reportId }
    );
  }

  private async updateReportIdForExistingReportAnswers(oldReportId: number, newReportId: number): Promise<void> {
    await this.dataSource.getRepository(Answer).update(
      { reportId: oldReportId },
      { reportId: newReportId }
    );
  }

  private async getUnconfirmedReportsByDateRange(startDate: Date, endDate: Date): Promise<AttReport[]> {
    return await this.dataSource.getRepository(AttReport).find({
      where: {
        userId: this.user.id,
        teacherId: this.teacher.id,
        reportDate: {
          $gte: startDate,
          $lte: endDate,
        } as any,
        isConfirmed: false,
      },
    });
  }

  private async saveReportAsConfirmed(reportId: number): Promise<void> {
    await this.dataSource.getRepository(AttReport).update(
      { id: reportId },
      { isConfirmed: true }
    );
  }

  private getReportMessage(report: AttReport): string {
    // TODO: Implement report message formatting based on teacher type
    const reportDate = formatHebrewDateForIVR(report.reportDate);
    return `דיווח מתאריך ${reportDate} - לחץ 9 לאישור או מספר אחר לעריכה`;
  }

  private async processClassCelebrationsListener(): Promise<void> {
    this.logger.log(`Processing class celebrations listener`);

    this.sendMessage(await this.getTextByUserId('CELEBRATIONS.WELCOME'));

    const grade = await this.getGradeForCelebrations();
    const classEntity = await this.getClassNumber(grade);

    const currentYear = getCurrentHebrewYear();
    const month = await this.getMonthForCelebrations(currentYear);

    await this.readClassCelebrations(classEntity, currentYear, month.name);

    this.hangupWithMessage(await this.getTextByUserId('CELEBRATIONS.GOODBYE'));
  }

  private async getGradeForCelebrations(): Promise<string> {
    this.logger.log(`Getting grade for celebrations`);

    const gradeInput = await this.askForInput(await this.getTextByUserId('CELEBRATIONS.GRADE_PROMPT'), {
      min_digits: 1,
      max_digits: 2,
    });

    const grade = parseInt(gradeInput);

    if (grade < 9 || grade > 14) {
      this.sendMessage(await this.getTextByUserId('CELEBRATIONS.INVALID_GRADE'));
      return this.getGradeForCelebrations();
    }

    const gradeName = gematriyaLetters(grade, false);
    this.logger.log(`Grade selected: ${gradeName} (${grade})`);
    return gradeName;
  }

  private async getClassNumber(grade: string): Promise<Class> {
    this.logger.log(`Getting class number for grade ${grade}`);

    const classNumberInput = await this.askForInput(await this.getTextByUserId('CELEBRATIONS.CLASS_PROMPT'), {
      min_digits: 1,
      max_digits: 2,
    });

    const classNumber = parseInt(classNumberInput);
    const expectedClassName = `${grade}${classNumber}`;

    const classEntity = await this.dataSource.getRepository(Class).findOne({
      where: {
        userId: this.user.id,
        name: expectedClassName,
        gradeLevel: grade,
      },
    });

    if (!classEntity) {
      this.sendMessage(await this.getTextByUserId('CELEBRATIONS.INVALID_CLASS'));
      return this.getClassNumber(grade);
    }

    this.logger.log(`Class selected: ${expectedClassName}`);
    return classEntity;
  }

  private async getMonthForCelebrations(currentYear: number) {
    this.logger.log(`Getting month for celebrations`);

    const months = getHebrewMonthsList(currentYear);
    const month = await this.askForMenu('DATE.MONTH_SELECTION', months);
    if (!month) {
      this.sendMessage(await this.getTextByUserId('GENERAL.INVALID_INPUT'));
      return this.getMonthForCelebrations(currentYear);
    }

    this.logger.log(`Month selected: ${month.name} (${month.index})`);
    return month;
  }

  private async readClassCelebrations(classEntity: Class, currentYear: number, monthName: string): Promise<void> {
    this.logger.log(`Reading celebrations for class ${classEntity.name} month ${monthName}`);

    const events = await this.dataSource
      .getRepository(Event)
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.eventType', 'eventType')
      .innerJoin(Student, 'student', 'student.id = event.studentReferenceId')
      .innerJoin(StudentClass, 'studentClass', 'studentClass.studentReferenceId = student.id')
      .where('event.userId = :userId', { userId: this.user.id })
      .andWhere('studentClass.classReferenceId = :classId', { classId: classEntity.id })
      .andWhere('studentClass.year = :year', { year: currentYear })
      .andWhere('event.eventHebrewMonth = :monthName', { monthName })
      .orderBy('student.name', 'ASC')
      .addOrderBy('event.eventDate', 'ASC')
      .getMany();

    if (events.length === 0) {
      this.hangupWithMessage(
        await this.getTextByUserId('CELEBRATIONS.NO_CELEBRATIONS_FOUND', {
          className: classEntity.name,
          month: monthName,
        }),
      );
      return;
    }

    const studentsWithEvents = await this.dataSource
      .getRepository(Student)
      .createQueryBuilder('student')
      .where('student.id IN (:...studentIds)', {
        studentIds: events.map((e) => e.studentReferenceId),
      })
      .getMany();

    const studentMap = new Map(studentsWithEvents.map((s) => [s.id, s]));

    const eventsByStudent = events.reduce((acc, event) => {
      const student = studentMap.get(event.studentReferenceId);
      if (student) {
        const studentName = student.name;
        if (!acc[studentName]) {
          acc[studentName] = [];
        }
        acc[studentName].push(event);
      }
      return acc;
    }, {} as Record<string, Event[]>);

    this.sendMessage(
      await this.getTextByUserId('CELEBRATIONS.READING_START', {
        className: classEntity.name,
        month: monthName,
        count: events.length.toString(),
      }),
    );

    for (const [studentName, studentEvents] of Object.entries(eventsByStudent)) {
      this.sendMessage(await this.getTextByUserId('CELEBRATIONS.STUDENT_NAME', { name: studentName }));

      for (const event of studentEvents) {
        this.sendMessage(
          await this.getTextByUserId('CELEBRATIONS.EVENT_DETAIL', {
            eventType: event.eventType.name,
            date: formatHebrewDateForIVR(event.eventDate),
          }),
        );
      }
    }

    this.sendMessage(await this.getTextByUserId('CELEBRATIONS.READING_COMPLETE'));
  }
}
