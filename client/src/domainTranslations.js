import { generalResourceFieldsTranslation } from "@shared/providers/i18nProvider"

export default {
    menu_groups: {
        data: 'נתונים',
        reports: 'דוחות מורים',
        settings: 'הגדרות',
        admin: 'ניהול',
    },
    resources: {
        student: {
            name: 'תלמידה |||| תלמידות',
            fields: {
                ...generalResourceFieldsTranslation,
                tz: 'תעודת זהות',
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
                teacherTypeId: 'סוג מורה',
                price: 'מחיר לשעה',
                trainingTeacher: 'מורה מכשירה',
                specialQuestion: 'שאלה מיוחדת',
                studentCount: 'מספר תלמידות',
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
        att_report: {
            name: 'דוח נוכחות |||| דוחות נוכחות',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherId: 'מורה',
                reportDate: 'תאריך דוח',
                'reportDate:$gte': 'תאריך דוח מ-',
                'reportDate:$lte': 'תאריך דוח עד-',
                updateDate: 'תאריך עדכון',
                year: 'שנה',
                isConfirmed: 'מאושר',
                salaryReport: 'דוח שכר',
                salaryMonth: 'חודש שכר',
                comment: 'הערה',
                howManyStudents: 'כמה תלמידות',
                howManyLessons: 'מספר שיעורים',
                howManyWatchOrIndividual: 'מספר צפיות או אישיות',
                howManyTeachedOrInterfering: 'מספר הוראות או התערבויות',
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
                wasDiscussing: 'היה דיון',
                wasKamal: 'היה כמל',
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
                teacherTypeId: 'סוג מורה',
                questionTypeId: 'סוג שאלה',
                content: 'תוכן השאלה',
                'content:$cont': 'חיפוש בתוכן',
                allowedDigits: 'ספרות מותרות',
                isStandalone: 'שאלה עצמאית',
                startDate: 'תאריך התחלה',
                'startDate:$gte': 'תאריך התחלה מ-',
                endDate: 'תאריך סיום',
                'endDate:$lte': 'תאריך סיום עד-',
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
                teacherId: 'מורה',
                questionId: 'שאלה',
                reportId: 'דוח',
                answer: 'תשובה',
                answerDate: 'תאריך תשובה',
                'answerDate:$gte': 'תאריך תשובה מ-',
                'answerDate:$lte': 'תאריך תשובה עד-',
            }
        },
        working_date: {
            name: 'תאריך עבודה |||| תאריכי עבודה',
            fields: {
                ...generalResourceFieldsTranslation,
                teacherTypeId: 'סוג מורה',
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

        // Entities from shared/components/common-entities
        text: {
            name: 'הודעה |||| הודעות - טבלת אדמין',
            fields: {
                ...generalResourceFieldsTranslation,
                description: 'תיאור',
                value: 'ערך',
            }
        },
        text_by_user: {
            name: 'הודעה |||| הודעות',
            fields: {
                ...generalResourceFieldsTranslation,
                description: 'תיאור',
                value: 'ערך',
            }
        },
        page: {
            name: 'הסבר למשתמשים',
            fields: {
                ...generalResourceFieldsTranslation,
                description: 'כותרת',
                value: 'תוכן',
            }
        },
        user: {
            name: 'משתמש |||| משתמשים',
            fields: {
                ...generalResourceFieldsTranslation,
                email: 'כתובת מייל',
                password: 'סיסמא',
                phoneNumber: 'מספר טלפון',
                userInfo: 'מידע על המשתמש',
                isPaid: 'האם שילם?',
                paymentMethod: 'אופן התשלום',
                mailAddressAlias: 'כתובת המייל ממנה יישלחו מיילים',
                mailAddressTitle: 'שם כתובת המייל',
                bccAddress: 'כתובת מייל לשליחת עותק',
                paymentTrackId: 'תוכנית',
                effective_id: 'משויך למשתמש',
                permissions: 'הרשאות',
                additionalData: 'נתונים נוספים',
                'additionalData.trialEndDate': 'תאריך חובת תשלום',
                'additionalData.customTrialMessage': 'הודעה מקדימה חובת תשלום',
                'additionalData.customTrialEndedMessage': 'הודעת סיום חובת תשלום',
            }
        },
        import_file: {
            name: 'קבצים שהועלו',
            fields: {
                ...generalResourceFieldsTranslation,
                fileName: 'שם הקובץ',
                fileSource: 'מקור הקובץ',
                entityIds: 'רשומות',
                entityName: 'סוג טבלה',
                fullSuccess: 'הצלחה',
                response: 'תגובה',
            }
        },
        mail_address: {
            name: 'כתובת מייל |||| כתובות מייל',
            fields: {
                ...generalResourceFieldsTranslation,
                alias: 'כתובת המייל',
                entity: 'טבלת יעד',
            }
        },
        audit_log: {
            name: 'נתונים שהשתנו',
            fields: {
                ...generalResourceFieldsTranslation,
                entityId: 'מזהה שורה',
                entityName: 'טבלה',
                operation: 'פעולה',
                entityData: 'המידע שהשתנה',
                isReverted: 'שוחזר',
            }
        },
        recieved_mail: {
            name: 'מיילים שהתקבלו',
            fields: {
                ...generalResourceFieldsTranslation,
                from: 'מאת',
                to: 'אל',
                subject: 'כותרת',
                body: 'תוכן',
                entityName: 'טבלת יעד',
                importFileIds: 'קבצים מצורפים',
            }
        },
        image: {
            name: 'תמונה |||| תמונות',
            fields: {
                ...generalResourceFieldsTranslation,
                fileData: 'תמונה',
                'fileData.src': 'תמונה',
                imageTarget: 'יעד',
            }
        },
        payment_track: {
            name: 'מסלול תשלום |||| מסלולי תשלום',
            fields: {
                ...generalResourceFieldsTranslation,
                description: 'תיאור',
                monthlyPrice: 'מחיר חודשי',
                annualPrice: 'מחיר שנתי',
                studentNumberLimit: 'מספר משתתפים',
            }
        },
        yemot_call: {
            name: 'שיחה |||| שיחות',
            fields: {
                ...generalResourceFieldsTranslation,
                phone: 'מאת',
                'phone:$cont': 'מאת',
                currentStep: 'שלב נוכחי',
                hasError: 'שגיאה?',
                errorMessage: 'הודעת שגיאה',
                'errorMessage:$cont': 'הודעת שגיאה',
                history: 'שלבים',
                data: 'נתונים',
                isOpen: 'פעיל?',
                apiCallId: 'מזהה שיחה (ימות)',
            },
        }
    }
};
