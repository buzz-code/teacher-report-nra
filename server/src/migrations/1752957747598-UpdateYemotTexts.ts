import { Text } from "@shared/entities/Text.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateYemotTexts1752957747598 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM \`texts\` WHERE 1 = 1;
        `);

        const textRepo = queryRunner.manager.getRepository(Text);
        const texts = [
            // Teacher and general messages
            { name: 'TEACHER.PHONE_NOT_RECOGNIZED', text: 'הטלפון לא מזוהה במערכת' },
            { name: 'TEACHER.WELCOME', text: 'שלום, {name}, ברוכה הבאה למערכת דיווחי {teacherTypeName}' },
            { name: 'TEACHER.TYPE_NOT_RECOGNIZED', text: 'סוג המורה לא מזוהה במערכת' },

            // Questions and answers
            { name: 'QUESTION.CHOOSE_ANSWER', text: 'נא לבחור תשובה' },

            // Report flow
            { name: 'REPORT.CHOOSE_DATE_TYPE', text: 'לדווח על היום הקישי 1, לדווח על תאריך אחר הקישי 2, לשמוע דיווחים הקישי 3' },
            { name: 'REPORT.CHOOSE_DATE', text: 'הקישי תאריך בפורמט יום חודש שנה, 8 ספרות' },
            { name: 'REPORT.CONFIRM_DATE', text: 'האם התאריך שבחרת הוא {date}? לאישור הקישי 1, לשינוי הקישי 2' },
            { name: 'REPORT.DATA_SAVED_SUCCESS', text: 'הנתונים נשמרו בהצלחה' },
            { name: 'REPORT.DATA_NOT_SAVED', text: 'הנתונים לא נשמרו' },

            // Manha report
            { name: 'REPORT.MANHA_REPORT_TYPE', text: 'האם את מדווחת על עצמך הקישי 1, או על מורות אחרות הקישי 2' },
            { name: 'REPORT.HOW_MANY_METHODIC', text: 'כמה שיעורי מתודיקה היו?' },
            { name: 'REPORT.FOUR_LAST_DIGITS_OF_TEACHER_PHONE', text: 'הקישי 4 ספרות אחרונות של הטלפון של המורה' },
            { name: 'REPORT.IS_TAARIF_HULIA', text: 'כמה שיעורי צפיה בחוליה רגילה?' },
            { name: 'REPORT.IS_TAARIF_HULIA2', text: 'כמה שיעורי צפיה בחוליה גדולה?' },
            { name: 'REPORT.IS_TAARIF_HULIA3', text: 'כמה שיעורים היו בחוליה ה 2?' },
            { name: 'REPORT.HOW_MANY_WATCHED_LESSONS', text: 'כמה שיעורי צפיה?' },
            { name: 'REPORT.HOW_MANY_STUDENTS_TEACHED', text: 'כמה בנות מסרו היום שיעור?' },
            { name: 'REPORT.HOW_MANY_YALKUT_LESSONS', text: 'כמה שיעורי ילקוט הרועים?' },
            { name: 'REPORT.HOW_MANY_STUDENTS_HELP_TEACHED', text: 'כמה שיעורי מרתון עזרת לתלמידות למסור?' },
            { name: 'REPORT.ANOTHER_TEACHER_REPORT', text: 'האם תרצי לדווח על מורה נוספת? הקישי 1 לכן, 2 לסיום' },
            { name: 'REPORT.GOODBYE_TO_MANHA_TEACHER', text: 'תודה רבה וברכה' },

            // Seminar Kita report
            { name: 'REPORT.HOW_MANY_STUDENTS_SEMINAR_KITA', text: 'כמה תלמידות היו אצלך היום' },
            { name: 'REPORT.HOW_MANY_LESSONS_SEMINAR_KITA', text: 'על כמה שיעורי סמינר כתה תרצי לדווח' },
            { name: 'REPORT.HOW_MANY_WATCH_OR_INDIVIDUAL', text: 'מתוכם כמה שיעורי צפיה או פרטני' },
            { name: 'REPORT.HOW_MANY_TEACHED_OR_INTERFERING', text: 'כמה שיעורי מסירה או מעורבות' },
            { name: 'REPORT.WAS_KAMAL', text: 'האם היה קמל?' },
            { name: 'REPORT.HOW_MANY_DISCUSSING_LESSONS', text: 'כמה שיעורי דיון' },
            { name: 'REPORT.HOW_MANY_LESSONS_ABSENCE_SEMINAR_KITA', text: 'כמה שיעורים התלמידות חסרו מסיבות אישיות' },
            { name: 'REPORT.ANOTHER_DATE_REPORT', text: 'האם תרצי לדווח על יום נוסף? הקישי 1 לכן, 2 לסיום' },

            // PDS report
            // (already covered by WATCH_OR_INDIVIDUAL, TEACHED_OR_INTERFERING, DISCUSSING_LESSONS)

            // Kindergarten report
            { name: 'REPORT.WAS_COLLECTIVE_WATCH', text: 'האם הייתה צפיה קולקטיבית?' },
            { name: 'REPORT.HOW_MANY_STUDENTS', text: 'כמה בנות היו בצפיה בגן?' },
            { name: 'REPORT.WAS_STUDENTS_GOOD', text: 'האם תפקוד הבנות ענה על ציפיותיך?' },

            // Special Education report
            { name: 'REPORT.HOW_MANY_LESSONS', text: 'כמה שיעורים היו?' },
            { name: 'REPORT.HOW_MANY_STUDENTS_WATCHED', text: 'כמה תלמידות צפו?' },
            { name: 'REPORT.WAS_PHONE_DISCUSSING', text: 'האם היה דיון טלפוני?' },
            { name: 'REPORT.WHO_IS_YOUR_TRAINING_TEACHER', text: 'מי המורה המנחה שלך?' },
            { name: 'REPORT.WHAT_IS_YOUR_SPECIALITY', text: 'מה ההתמחות?' },

            // Validation messages
            { name: 'VALIDATION.INVALID_DATE', text: 'תאריך לא חוקי' },
            { name: 'VALIDATION.CANNOT_REPORT_FUTURE', text: 'אי אפשר לדווח על העתיד' },
            { name: 'VALIDATION.CANNOT_REPORT_NON_WORKING_DAY', text: 'אי אפשר לדווח על יום שאינו יום עבודה' },
            { name: 'VALIDATION.CANNOT_REPORT_SALARY_REPORT', text: 'אי אפשר לשנות דיווח שכבר מקושר לחודש שכר' },
            { name: 'VALIDATION.CANNOT_REPORT_CONFIRMED', text: 'אי אפשר לשנות דיווח שאושר' },
            { name: 'VALIDATION.EXISTING_REPORT_WILL_BE_DELETED', text: 'דיווח קיים יימחק ויוחלף בדיווח החדש' },
            { name: 'VALIDATION.HAS_UNCONFIRMED_REPORTS', text: 'יש לך דיווחים לא מאושרים מחודשים קודמים' },
            { name: 'VALIDATION.CANNOT_REPORT_MORE_THAN_TEN_ABSENCES', text: 'לא ניתן לדווח על יותר מ-10 חיסורים' },
            { name: 'VALIDATION.SEMINAR_KITA_LESSON_COUNT', text: 'סכום השיעורים שדווחו לא תואם למספר הכולל' },

            // Teacher selection
            { name: 'TEACHER.NO_TEACHER_FOUND_BY_DIGITS', text: 'לא נמצאה מורה עם 4 ספרות אלו' },
            { name: 'TEACHER.CONFIRM_TEACHER_SINGLE', text: 'האם הכוונה למורה {teacherName}? לאישור הקישי 1, לשינוי הקישי 2' },
            { name: 'TEACHER.CONFIRM_TEACHER_MULTI', text: 'נמצאו מספר מורות: {teacherList}. הקישי מספר המורה או 0 לחזרה' },

            // Student TZ collection
            { name: 'STUDENT.TZ_PROMPT', text: 'הקישי את מ.ז. של התלמידה מספר {number}' },
            { name: 'STUDENT.NOT_FOUND', text: 'לא נמצאה תלמידה עם תעודת זהות זו' },
            { name: 'STUDENT.CONFIRM', text: 'האם הכוונה לתלמידה {studentName}? לאישור הקישי 1, לשינוי הקישי 2' },

            // Reports viewing
            { name: 'REPORT.CHOOSE_REPORTS_MONTH', text: 'על איזה חודש תרצי לשמוע דיווחים' },
            { name: 'REPORT.NO_REPORT_FOUND', text: 'לא נמצאו דיווחים' },

            // Report validation confirmations
            { name: 'REPORT.VALIDATION_CONFIRM_MANHA', text: 'נא לאשר את הדיווח: מורה {teacherName}, חוליה רגילה {hulia1}, חוליה גדולה {hulia2}, צפיות {watch}, מסירות {teach}, ילקוט {yalkut}, דיונים {discuss}, עזרה {help}, חוליה 2 {hulia3}. לאישור הקישי 1, לשינוי הקישי 2' },
            { name: 'REPORT.VALIDATION_CONFIRM_PDS', text: 'נא לאשר את הדיווח: צפיה/פרטני {watchIndiv}, מסירה/מעורבות {teachInterf}, דיונים {discuss}. לאישור הקישי 1, לשינוי הקישי 2' },

            // Previous reports messages
            { name: 'REPORT.SEMINAR_KITA_PREVIOUS', text: 'דיווח מתאריך {date}, שיעורים {lessons}, צפיה/פרטני {watchIndiv}, מסירה/מעורבות {teachInterf}, דיונים {discuss}, חיסורים {absence}, קמל {kamal}, תלמידות {students}. לאישור הקישי 9, לעריכה הקישי מספר אחר' },
            { name: 'REPORT.MANHA_PREVIOUS', text: 'דיווח מתאריך {date}, מתודיקה {methodic}, טלפון {phone}, חוליה רגילה {hulia1}, חוליה גדולה {hulia2}, צפיות {watch}, מסירות {teach}, מ.ז. תלמידות {studentTz}, ילקוט {yalkut}, דיונים {discuss}, עזרה {help}, חוליה 2 {hulia3}. לאישור הקישי 9, לעריכה הקישי מספר אחר' },
            { name: 'REPORT.PDS_PREVIOUS', text: 'דיווח מתאריך {date}, צפיה/פרטני {watchIndiv}, מסירה/מעורבות {teachInterf}, דיונים {discuss}. לאישור הקישי 9, לעריכה הקישי מספר אחר' },
            { name: 'REPORT.KINDERGARTEN_PREVIOUS', text: 'דיווח מתאריך {date}, תלמידות {students}, דיון {discuss}, תפקוד טוב {studentsGood}, כניסה בזמן {enterOnTime}, יציאה בזמן {exitOnTime}, צפיה קולקטיבית {collective}. לאישור הקישי 9, לעריכה הקישי מספר אחר' },
            { name: 'REPORT.SPECIAL_EDUCATION_PREVIOUS', text: 'דיווח מתאריך {date}, שיעורים {lessons}, צופות {studentsWatched}, מוסרות {studentsTeached}, דיון טלפוני {phoneDiscuss}, מורה מנחה {trainingTeacher}, התמחות {speciality}. לאישור הקישי 9, לעריכה הקישי מספר אחר' },

            // General messages
            { name: 'GENERAL.INVALID_INPUT', text: 'הנתון שהקשת לא תקין' },
            { name: 'GENERAL.YES', text: 'לאישור הקישי 1' },
            { name: 'GENERAL.NO', text: 'לשינוי הקישי 2' },
        ];

        await textRepo.save(texts.map(text => ({
            name: text.name,
            value: text.text,
            description: text.text,
            userId: 0,
        })));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Rollback by deleting all texts - in production you might want to backup first
        await queryRunner.query(`
            DELETE FROM \`texts\` WHERE 1 = 1;
        `);
    }

}
