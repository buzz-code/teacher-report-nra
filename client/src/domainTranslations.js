import { generalResourceFieldsTranslation } from "@shared/providers/i18nProvider"
import { sharedEntityTranslations } from "@shared/entities/shared-entity.translations"

export default {
    menu_groups: {
        data: 'נתונים',
        reports: 'דוחות מורים',
        settings: 'הגדרות',
        admin: 'ניהול',
    },
    resources: {
        ...sharedEntityTranslations,
        student_group: {
            name: 'קבוצת תלמידות |||| קבוצות תלמידות',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherTz: 'ת.ז. מורה',
                teacherReferenceId: 'מורה',
                startDate: 'מתאריך',
                endDate: 'עד תאריך',
                studentCount: 'מספר תלמידות',
                trainingTeacher: 'מורה מכשירה',
            }
        },
        teacher: {
            name: 'מורה |||| מורות',
            fields: {
                ...generalResourceFieldsTranslation,
                ownUserId: 'משתמש משויך',
                tz: 'תעודת זהות',
                phone: 'טלפון',
                email: 'דואל',
                school: 'בית ספר',
                teacherTypeKey: 'סוג מורה',
                teacherTypeReferenceId: 'סוג מורה',
                trainingTeacher: 'מורה מכשירה - ישן',
                studentCount: 'מספר תלמידות - ישן',
            }
        },
        
        // Teacher Report System Entities
        teacher_type: {
            name: 'סוג מורה |||| סוגי מורות',
            fields: {
                ...generalResourceFieldsTranslation,
                key: 'מזהה',
                name: 'שם',
                'name:$cont': 'חיפוש בשם',
            }
        },
        teacher_question: {
            name: 'שיוך שאלה למורה |||| שיוכי שאלות למורים',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                questionReferenceId: 'שאלה',
                answerReferenceId: 'תשובה',
            }
        },
        att_report: {
            name: 'תיקוף נוכחות |||| תיקופי נוכחות',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                reportDate: 'תאריך דוח',
                'reportDate:$gte': 'תאריך דוח מ-',
                'reportDate:$lte': 'תאריך דוח עד-',
                updateDate: 'תאריך עדכון',
                year: 'שנה',
                isConfirmed: 'מאושר',
                salaryReportId: 'דוח שכר',
                salaryMonth: 'חודש שכר',
                comment: 'הערה',
                howManyStudents: 'מספר תלמידות',
                howManyLessons: 'מספר שיעורים',
                howManyWatchOrIndividual: 'צפיה או פרטני',
                howManyTeachedOrInterfering: 'מסירה או מעורבות',
                howManyMethodic: 'כמה מתודיקה',
                fourLastDigitsOfTeacherPhone: '4 ספרות אחרונות של טלפון',
                teachedStudentTz: 'תלמידות שנלמדו (ת.ז.)',
                howManyYalkutLessons: 'כמה שיעורי ילקוט',
                howManyDiscussingLessons: 'כמה שיעורי דיון',
                howManyStudentsTeached: 'מספר תלמידים שהורו',
                howManyStudentsHelpTeached: 'כמה תלמידות עזרו ללמד',
                howManyLessonsAbsence: 'כמה שיעורי היעדרות',
                howManyWatchedLessons: 'כמה שיעורי צפייה',
                howManyStudentsWatched: 'מספר תלמידים שנצפו',
                wasDiscussing: 'דיון',
                wasKamal: 'קמל',
                wasStudentsGood: 'התלמידות היו טובות',
                wasStudentsEnterOnTime: 'התלמידות נכנסו בזמן',
                wasStudentsExitOnTime: 'התלמידות יצאו בזמן',
                wasPhoneDiscussing: 'האם היה דיון טלפוני',
                wasCollectiveWatch: 'היתה צפייה קבוצתית',
                activityType: 'סוג פעילות',
                teacherToReportFor: 'מורה לדווח עליה',
                isTaarifHulia: 'תעריף חוליה',
                isTaarifHulia2: 'תעריף חוליה 2',
                isTaarifHulia3: 'תעריף חוליה 3',
                whatIsYourSpeciality: 'מה ההתמחות שלך',
                price: 'מחיר',
                priceExplanation: 'פירוט מחיר',
            }
        },
        'teacher/pivot?extra.pivot=TeacherValidation': {
            name: 'דוח פיבוט תאריכים',
            fields: {
                ...generalResourceFieldsTranslation,
                name: 'שם המורה',
                teacherTypeReferenceId: 'סוג מורה',
            }
        },
        att_type: {
            name: 'סוג פעילות |||| סוגי פעילויות',
            fields: {
                ...generalResourceFieldsTranslation,
                name: 'שם',
                'name:$cont': 'חיפוש בשם',
            }
        },
        price: {
            name: 'מחיר |||| מחירים',
            fields: {
                ...generalResourceFieldsTranslation,
                key: 'מזהה',
                price: 'מחיר',
            }
        },
        question: {
            name: 'שאלה |||| שאלות',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherTypeKey: 'סוג מורה',
                teacherTypeReferenceId: 'סוג מורה',
                questionTypeKey: 'סוג שאלה',
                questionTypeReferenceId: 'סוג שאלה',
                content: 'תוכן השאלה',
                'content:$cont': 'חיפוש בתוכן',
                upperLimit: 'גבול עליון',
                lowerLimit: 'גבול תחתון',
                tariff: 'תעריף',
                isMandatory: 'חובה לענות',
                startDate: 'תאריך התחלה',
                'startDate:$gte': 'תאריך התחלה מ-',
                endDate: 'תאריך סיום',
                'endDate:$lte': 'תאריך סיום עד-',
                effectiveDate: 'תאריך אפקטיבי לדיווח',
            }
        },
        question_type: {
            name: 'סוג שאלה |||| סוגי שאלות',
            fields: {
                ...generalResourceFieldsTranslation,
                key: 'מזהה',
                name: 'שם',
                'name:$cont': 'חיפוש בשם',
            }
        },
        answer: {
            name: 'תשובה |||| תשובות',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                questionId: 'שאלה',
                questionReferenceId: 'שאלה',
                salaryReportId: 'דוח שכר',
                answer: 'תשובה',
                calculatedPayment: 'תשלום מחושב',
                reportDate: 'תאריך דיווח',
                'reportDate:$gte': 'תאריך דיווח מ-',
                'reportDate:$lte': 'תאריך דיווח עד-',
            }
        },
        working_date: {
            name: 'תאריך עבודה |||| תאריכי עבודה',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherTypeKey: 'סוג מורה',
                teacherTypeReferenceId: 'סוג מורה',
                workingDate: 'תאריך עבודה',
                'workingDate:$gte': 'תאריך עבודה מ-',
                'workingDate:$lte': 'תאריך עבודה עד-',
            }
        },
        salary_report: {
            name: 'דוח שכר |||| דוחות שכר',
            fields: {
                ...generalResourceFieldsTranslation,
                ids: 'מזהי דוחות',
                date: 'תאריך',
                'date:$gte': 'תאריך מ-',
                'date:$lte': 'תאריך עד-',
                name: 'שם',
                'name:$cont': 'חיפוש בשם',
            }
        },
        
        // Common Settings and Utilities - to keep as requested
        settings: {
            name: 'הגדרות',
            fields: {
                defaultPageSize: 'מספר שורות בטבלה',
                dashboardItems: 'הגדרות לוח מחוונים',
                'dashboardItems.resource': 'מקור נתונים',
                'dashboardItems.resourceHelperText': 'בחר את מקור הנתונים שברצונך להציג',
                'dashboardItems.yearFilterType': 'סוג סינון שנה',
                'dashboardItems.filter': 'פילטר נוסף בפורמט JSON (אופציונלי, ללא שנה)',
                'dashboardItems.title': 'כותרת',
                maintainanceMessage: 'הודעה לסגירת המערכת הטלפונית',
            }
        },
        price: {
            name: 'מחיר |||| מחירים - טבלת אדמין',
            fields: {
                ...generalResourceFieldsTranslation,
                code: 'מזהה',
                description: 'תיאור',
                price: 'מחיר',
            }
        },
        price_by_user: {
            name: 'מחיר פעיל |||| מחירים פעילים',
            fields: {
                ...generalResourceFieldsTranslation,
                code: 'מזהה',
                description: 'תיאור',
                price: 'מחיר נוכחי',
            }
        },

        salary_report: {
            name: 'דוח שכר |||| דוחות שכר',
            fields: {
                ...generalResourceFieldsTranslation,
                name: 'שם הדוח',
                'name:$cont': 'חיפוש בשם',
                date: 'תאריך',
                'date:$gte': 'תאריך מ-',
                'date:$lte': 'תאריך עד-',
            }
        },
        reportable_item: {
            name: 'פריט שכר |||| פריטי שכר',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                reportDate: 'תאריך דיווח',
                'reportDate:$gte': 'תאריך דיווח מ-',
                'reportDate:$lte': 'תאריך דיווח עד-',
                salaryReportId: 'דוח שכר',
                'salaryReportId:$isnull': 'סטטוס הקצאה',
                type: 'סוג',
                existingSalaryReportId: 'דוח שכר קיים',
                salaryReportName: 'שם דוח שכר',
                salaryReportDate: 'תאריך דוח שכר',
            },
            values: {
                type: {
                    answer: 'תשובה',
                    attendance_report: 'דיווח נוכחות'
                }
            }
        },
        att_report_with_price: {
            name: 'דוח נוכחות עם מחיר |||| דוחות נוכחות עם מחירים',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                teacherTz: 'ת.ז. מורה',
                reportDate: 'תאריך דוח',
                'reportDate:$gte': 'תאריך דוח מ-',
                'reportDate:$lte': 'תאריך דוח עד-',
                updateDate: 'תאריך עדכון',
                year: 'שנה',
                salaryReportId: 'דוח שכר',
                salaryMonth: 'חודש שכר',
                comment: 'הערה',
                teacherTypeReferenceId: 'סוג מורה',
                teacherTypeKey: 'מפתח סוג מורה',
                basePrice: 'תעריף בסיס',
                calculatedPrice: 'מחיר מחושב',
                // Field-specific price columns (use att_report translations for consistency)
                howManyStudents: 'כמה תלמידות',
                howManyLessons: 'מספר שיעורים',
                howManyWatchOrIndividual: 'מספר צפיות או אישיות',
                howManyTeachedOrInterfering: 'מספר הוראות או התערבויות',
                howManyDiscussingLessons: 'כמה שיעורי דיון',
                wasKamal: 'היה כמל',
                howManyLessonsAbsence: 'כמה שיעורי היעדרות',
                howManyMethodic: 'כמה מתודיקה',
                isTaarifHulia: 'תעריף חוליה',
                isTaarifHulia2: 'תעריף חוליה 2',
                isTaarifHulia3: 'תעריף חוליה 3',
                howManyWatchedLessons: 'כמה שיעורי צפייה',
                howManyYalkutLessons: 'כמה שיעורי ילקוט',
                howManyStudentsHelpTeached: 'כמה תלמידות עזרו ללמד',
                howManyStudentsTeached: 'מספר תלמידים שהורו',
                wasCollectiveWatch: 'היתה צפייה קבוצתית',
                howManyStudentsWatched: 'מספר תלמידים שנצפו',
                wasPhoneDiscussing: 'האם היה דיון טלפוני',
            }
        },
        answer_with_price: {
            name: 'תשובה עם מחיר |||| תשובות עם מחירים',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                teacherTz: 'ת.ז. מורה',
                questionReferenceId: 'שאלה',
                questionId: 'מזהה שאלה',
                salaryReportId: 'דוח שכר',
                answer: 'תשובה',
                reportDate: 'תאריך דיווח',
                'reportDate:$gte': 'תאריך דיווח מ-',
                'reportDate:$lte': 'תאריך דיווח עד-',
                questionContent: 'תוכן השאלה',
                questionTariff: 'תעריף',
                questionTypeReferenceId: 'סוג שאלה',
                questionTypeKey: 'מפתח סוג שאלה',
                calculatedPrice: 'מחיר מחושב',
            }
        },
        reportable_item_with_price: {
            name: 'פריט שכר עם מחיר |||| פריטי שכר עם מחירים',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherReferenceId: 'מורה',
                reportDate: 'תאריך דיווח',
                'reportDate:$gte': 'תאריך דיווח מ-',
                'reportDate:$lte': 'תאריך דיווח עד-',
                salaryReportId: 'דוח שכר',
                'salaryReportId:$isnull': 'סטטוס הקצאה',
                type: 'סוג',
                calculatedPrice: 'מחיר מחושב',
                existingSalaryReportId: 'דוח שכר קיים',
                salaryReportName: 'שם דוח שכר',
                salaryReportDate: 'תאריך דוח שכר',
            },
            values: {
                type: {
                    answer: 'תשובה',
                    attendance_report: 'דיווח נוכחות'
                }
            }
        },
        salary_report_by_teacher: {
            name: 'דוח שכר לפי מורה |||| דוחות שכר לפי מורה',
            fields: {
                ...generalResourceFieldsTranslation,
                salaryReportId: 'דוח שכר',
                teacherReferenceId: 'מורה',
                'salaryReport.name': 'שם דוח',
                'salaryReport.date': 'תאריך',
                'salaryReport.year': 'שנה',
                'salaryReport.createdAt': 'נוצר',
                'salaryReport.updatedAt': 'עודכן',
                reportYear: 'שנה לועזית',
                reportMonth: 'חודש לועזי',
                answerCount: 'מספר תשובות',
                answersTotal: 'סכום תשובות',
                attReportCount: 'מספר דוחות נוכחות',
                attReportsTotal: 'סכום דוחות נוכחות',
                grandTotal: 'סה"כ כולל',
            }
        }
    },
    priceExplanation: {
        basePrice: 'תעריף בסיס',
        total: 'סה"כ',
        currency: '₪',
        multiplier: '×',
        equals: '=',
    }
};
