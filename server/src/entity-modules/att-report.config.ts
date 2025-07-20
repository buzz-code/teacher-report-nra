import { CrudRequest } from "@dataui/crud";
import { getUserIdFromUser } from "@shared/auth/auth.util";
import { BaseEntityService } from "@shared/base-entity/base-entity.service";
import { BaseEntityModuleOptions, Entity } from "@shared/base-entity/interface";
import { IHeader } from "@shared/utils/exporter/types";
import { AttReport } from "src/db/entities/AttReport.entity";

function getConfig(): BaseEntityModuleOptions {
    return {
        entity: AttReport,
        query: {
            join: {
                teacher: { eager: true },
                user: {},
                attType: {},
            }
        },
        exporter: {
            processReqForExport(req: CrudRequest, innerFunc) {
                req.options.query.join = {
                    teacher: { eager: true },
                    user: { eager: true },
                    attType: { eager: true },
                };
                return innerFunc(req);
            },
            getExportHeaders(): IHeader[] {
                return [
                    { value: 'id', label: 'מזהה' },
                    { value: 'teacher.name', label: 'שם המורה' },
                    { value: 'reportDate', label: 'תאריך דיווח' },
                    { value: 'updateDate', label: 'תאריך עדכון' },
                    { value: 'year', label: 'שנה' },
                    { value: 'isConfirmed', label: 'מאושר' },
                    { value: 'comment', label: 'הערות' },
                    { value: 'howManyStudents', label: 'כמות תלמידים' },
                    { value: 'howManyMethodic', label: 'כמות מתודיקה' },
                    { value: 'fourLastDigitsOfTeacherPhone', label: 'ארבע ספרות אחרונות של טלפון' },
                    { value: 'teachedStudentTz', label: 'תעודת זהות תלמיד שנלמד' },
                    { value: 'howManyYalkutLessons', label: 'כמות שיעורי ילקוט' },
                    { value: 'howManyDiscussingLessons', label: 'כמות שיעורי דיון' },
                    { value: 'howManyStudentsHelpTeached', label: 'כמות תלמידים שעזרו ללמד' },
                    { value: 'howManyLessonsAbsence', label: 'כמות שיעורים שנעדרו' },
                    { value: 'howManyWatchedLessons', label: 'כמות שיעורים שנצפו' },
                    { value: 'wasDiscussing', label: 'היה דיון' },
                    { value: 'wasKamal', label: 'היה כמל' },
                    { value: 'wasStudentsGood', label: 'התלמידים היו טובים' },
                    { value: 'wasStudentsEnterOnTime', label: 'התלמידים נכנסו בזמן' },
                    { value: 'wasStudentsExitOnTime', label: 'התלמידים יצאו בזמן' },
                    { value: 'attType.name', label: 'סוג פעילות' },
                    { value: 'teacherToReportFor', label: 'מורה לדווח עליה' },
                    { value: 'wasCollectiveWatch', label: 'היה צפייה קולקטיבית' },
                    { value: 'isTaarifHulia', label: 'תעריף חוליה' },
                    { value: 'isTaarifHulia2', label: 'תעריף חוליה 2' },
                    { value: 'isTaarifHulia3', label: 'תעריף חוליה 3' },
                ];
            }
        },
        service: AttReportService,
    }
}

interface AttReportWithTeacherType extends AttReport {
    teacherType?: number;
    // Additional fields that can be added dynamically based on teacher type
    relevantFields?: string[];
    fieldVisibility?: Record<string, boolean>;
}

class AttReportService<T extends Entity | AttReport> extends BaseEntityService<T> {
    protected async populatePivotData(pivotName: string, list: T[], extra: any, filter: any, auth: any) {
        const data = list as AttReportWithTeacherType[];
        const userId = getUserIdFromUser(auth);

        switch (pivotName) {
            case 'TeacherType1': // Seminar Kita Reports
                data.forEach(item => {
                    item.teacherType = 1;
                    item.relevantFields = [
                        'howManyStudents', 'howManyMethodic', 'howManyWatchedLessons', 
                        'howManyStudentsHelpTeached', 'howManyLessonsAbsence', 
                        'wasKamal', 'howManyDiscussingLessons'
                    ];
                    item.fieldVisibility = {
                        howManyStudents: true,
                        howManyMethodic: true,
                        howManyWatchedLessons: true,
                        howManyStudentsHelpTeached: true,
                        howManyLessonsAbsence: true,
                        wasKamal: true,
                        howManyDiscussingLessons: true,
                        // Hide irrelevant fields
                        fourLastDigitsOfTeacherPhone: false,
                        teachedStudentTz: false,
                        howManyYalkutLessons: false,
                        teacherToReportFor: false,
                        isTaarifHulia: false,
                        isTaarifHulia2: false,
                        isTaarifHulia3: false,
                    };
                });
                break;

            case 'TeacherType3': // Manha Reports
                data.forEach(item => {
                    item.teacherType = 3;
                    item.relevantFields = [
                        'howManyMethodic', 'fourLastDigitsOfTeacherPhone', 'isTaarifHulia',
                        'isTaarifHulia2', 'teachedStudentTz', 'howManyYalkutLessons',
                        'howManyStudentsHelpTeached'
                    ];
                    item.fieldVisibility = {
                        howManyMethodic: true,
                        fourLastDigitsOfTeacherPhone: true,
                        isTaarifHulia: true,
                        isTaarifHulia2: true,
                        teachedStudentTz: true,
                        howManyYalkutLessons: true,
                        howManyStudentsHelpTeached: true,
                        // Hide irrelevant fields
                        howManyStudents: false,
                        wasKamal: false,
                        howManyDiscussingLessons: false,
                        wasCollectiveWatch: false,
                        wasStudentsEnterOnTime: false,
                        wasStudentsExitOnTime: false,
                        isTaarifHulia3: false,
                    };
                });
                break;

            case 'TeacherType5': // PDS Reports
                data.forEach(item => {
                    item.teacherType = 5;
                    item.relevantFields = [
                        'howManyWatchedLessons', 'howManyStudentsHelpTeached', 'howManyDiscussingLessons'
                    ];
                    item.fieldVisibility = {
                        howManyWatchedLessons: true,
                        howManyStudentsHelpTeached: true,
                        howManyDiscussingLessons: true,
                        // Hide irrelevant fields
                        howManyStudents: false,
                        howManyMethodic: false,
                        fourLastDigitsOfTeacherPhone: false,
                        teachedStudentTz: false,
                        howManyYalkutLessons: false,
                        wasKamal: false,
                        teacherToReportFor: false,
                        wasCollectiveWatch: false,
                        isTaarifHulia: false,
                        isTaarifHulia2: false,
                        isTaarifHulia3: false,
                    };
                });
                break;

            case 'TeacherType7': // Special Education Reports
                data.forEach(item => {
                    item.teacherType = 7;
                    item.relevantFields = [
                        'howManyLessonsAbsence', 'howManyWatchedLessons', 'howManyStudentsHelpTeached',
                        'fourLastDigitsOfTeacherPhone', 'teacherToReportFor', 'specialQuestion'
                    ];
                    item.fieldVisibility = {
                        howManyLessonsAbsence: true,
                        howManyWatchedLessons: true,
                        howManyStudentsHelpTeached: true,
                        fourLastDigitsOfTeacherPhone: true,
                        teacherToReportFor: true,
                        // Hide irrelevant fields
                        howManyStudents: false,
                        howManyMethodic: false,
                        teachedStudentTz: false,
                        howManyYalkutLessons: false,
                        howManyDiscussingLessons: false,
                        wasKamal: false,
                        wasCollectiveWatch: false,
                        isTaarifHulia: false,
                        isTaarifHulia2: false,
                        isTaarifHulia3: false,
                    };
                });
                break;

            case 'TeacherType6': // Kindergarten Reports
                data.forEach(item => {
                    item.teacherType = 6;
                    item.relevantFields = [
                        'wasCollectiveWatch', 'howManyWatchedLessons', 'wasStudentsGood',
                        'wasStudentsEnterOnTime', 'wasStudentsExitOnTime'
                    ];
                    item.fieldVisibility = {
                        wasCollectiveWatch: true,
                        howManyWatchedLessons: true,
                        wasStudentsGood: true,
                        wasStudentsEnterOnTime: true,
                        wasStudentsExitOnTime: true,
                        // Hide irrelevant fields
                        howManyStudents: false,
                        howManyMethodic: false,
                        fourLastDigitsOfTeacherPhone: false,
                        teachedStudentTz: false,
                        howManyYalkutLessons: false,
                        howManyDiscussingLessons: false,
                        wasKamal: false,
                        teacherToReportFor: false,
                        isTaarifHulia: false,
                        isTaarifHulia2: false,
                        isTaarifHulia3: false,
                    };
                });
                break;

            case 'MonthlyReport': // Total Monthly Reports (aggregated)
                // This could include salary calculation logic later
                data.forEach(item => {
                    item.teacherType = 0; // All types
                    item.relevantFields = [
                        'salaryReport', 'salaryMonth', 'isConfirmed'
                    ];
                    item.fieldVisibility = {
                        salaryReport: true,
                        salaryMonth: true,
                        isConfirmed: true,
                        // This view is primarily for read-only aggregated data
                        howManyStudents: true,
                        howManyMethodic: true,
                        howManyWatchedLessons: true,
                        howManyStudentsHelpTeached: true,
                        howManyLessonsAbsence: true,
                        howManyYalkutLessons: true,
                        howManyDiscussingLessons: true,
                    };
                });
                break;

            default:
                // No pivot - show all fields (original att-report behavior)
                data.forEach(item => {
                    item.teacherType = null;
                    item.fieldVisibility = {}; // All fields visible by default
                });
                break;
        }

        // Add headers for the pivot data
        if (pivotName && data.length > 0) {
            const headers = {};
            headers['teacherType'] = { value: 'teacherType', label: 'סוג מורה' };
            headers['relevantFields'] = { value: 'relevantFields', label: 'שדות רלוונטיים' };
            headers['fieldVisibility'] = { value: 'fieldVisibility', label: 'ניראות שדות' };
            (data[0] as any).headers = Object.values(headers);
        }
    }
}

export default getConfig();