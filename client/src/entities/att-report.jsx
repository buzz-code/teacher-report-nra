import { 
    DateField, 
    DateInput, 
    DateTimeInput, 
    maxLength, 
    NumberInput, 
    NumberField, 
    ReferenceField, 
    required, 
    TextField, 
    TextInput,
    BooleanField,
    BooleanInput 
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn label="מורה" />,
    <DateInput source="reportDate:$gte" label="תאריך דוח מ-" />,
    <DateInput source="reportDate:$lte" label="תאריך דוח עד-" />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn label="שנה" />,
    <BooleanInput source="isConfirmed" label="מאושר" />,
    <CommonReferenceInputFilter source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} label="דוח שכר" />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} label="סוג פעילות" />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Show meaningful identifiers and main fields */}
            <ReferenceField source="teacherId" reference="teacher" label="מורה" sortBy="teacher.name" />
            <DateField source="reportDate" label="תאריך דוח" sortable />
            <DateField showDate showTime source="updateDate" label="תאריך עדכון" sortable />
            <NumberField source="year" label="שנה" sortable />
            <BooleanField source="isConfirmed" label="מאושר" />
            <ReferenceField source="salaryReport" reference="salary_report" label="דוח שכר" />
            <NumberField source="salaryMonth" label="חודש שכר" />
            <TextField source="comment" label="הערה" />
            <NumberField source="howManyStudents" label="כמה תלמידות" />
            <NumberField source="howManyMethodic" label="כמה מתודיקה" />
            <TextField source="fourLastDigitsOfTeacherPhone" label="4 ספרות אחרונות" />
            <BooleanField source="wasDiscussing" label="היה דיון" />
            <BooleanField source="wasKamal" label="היה כמל" />
            <BooleanField source="wasStudentsGood" label="התלמידות היו טובות" />
            <ReferenceField source="activityType" reference="att_type" label="סוג פעילות" sortBy="att_type.name" />
            <BooleanField source="isTaarifHulia" label="תעריף חוליה" />
            <BooleanField source="isTaarifHulia2" label="תעריף חוליה 2" />
            <BooleanField source="isTaarifHulia3" label="תעריף חוליה 3" />
            {/* Admin-only fields */}
            {isAdmin && <TextField source="id" label="מזהה פנימי" />}
            {isAdmin && <ReferenceField source="userId" reference="user" label="משתמש" />}
            {isAdmin && <DateField showDate showTime source="createdAt" label="נוצר ב-" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" label="עודכן ב-" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled label="מזהה פנימי" />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} label="משתמש" />}
        <CommonReferenceInput source="teacherId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} label="מורה" />
        <DateInput source="reportDate" validate={[required()]} label="תאריך דוח" />
        <DateTimeInput source="updateDate" label="תאריך עדכון" />
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} label="שנה" />
        <BooleanInput source="isConfirmed" label="מאושר" />
        
        {/* Salary fields */}
        <CommonReferenceInput source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} label="דוח שכר" />
        <NumberInput source="salaryMonth" label="חודש שכר" />
        <TextInput source="comment" multiline label="הערה" />
        
        {/* Activity fields */}
        <NumberInput source="howManyStudents" label="כמה תלמידות" />
        <NumberInput source="howManyMethodic" label="כמה מתודיקה" />
        <TextInput source="fourLastDigitsOfTeacherPhone" validate={[maxLength(4)]} label="4 ספרות אחרונות של טלפון" />
        
        {/* Teaching fields */}
        <TextInput source="teachedStudentTz" multiline helperText="תעודות זהות של תלמידים שנלמדו" label="תלמידות שנלמדו (ת.ז.)" />
        <NumberInput source="howManyYalkutLessons" label="כמה שיעורי ילקוט" />
        <NumberInput source="howManyDiscussingLessons" label="כמה שיעורי דיון" />
        
        {/* Assessment fields */}
        <NumberInput source="howManyStudentsHelpTeached" label="כמה תלמידות עזרו ללמד" />
        <NumberInput source="howManyLessonsAbsence" label="כמה שיעורי היעדרות" />
        <NumberInput source="howManyWatchedLessons" label="כמה שיעורי צפייה" />
        
        {/* Boolean flags */}
        <BooleanInput source="wasDiscussing" label="היה דיון" />
        <BooleanInput source="wasKamal" label="היה כמל" />
        <BooleanInput source="wasStudentsGood" label="התלמידות היו טובות" />
        <BooleanInput source="wasStudentsEnterOnTime" label="התלמידות נכנסו בזמן" />
        <BooleanInput source="wasStudentsExitOnTime" label="התלמידות יצאו בזמן" />
        
        {/* Special fields */}
        <CommonReferenceInput source="activityType" reference="att_type" dynamicFilter={filterByUserId} label="סוג פעילות" />
        <NumberInput source="teacherToReportFor" label="מורה לדווח עליה" />
        <BooleanInput source="wasCollectiveWatch" label="היתה צפייה קבוצתית" />
        
        {/* Tariff fields */}
        <BooleanInput source="isTaarifHulia" label="תעריף חוליה" />
        <BooleanInput source="isTaarifHulia2" label="תעריף חוליה 2" />
        <BooleanInput source="isTaarifHulia3" label="תעריף חוליה 3" />
        
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: [
        'teacherId', 'reportDate', 'updateDate', 'year', 'isConfirmed',
        'salaryReport', 'salaryMonth', 'comment',
        'howManyStudents', 'howManyMethodic', 'fourLastDigitsOfTeacherPhone',
        'teachedStudentTz', 'howManyYalkutLessons', 'howManyDiscussingLessons',
        'howManyStudentsHelpTeached', 'howManyLessonsAbsence', 'howManyWatchedLessons',
        'wasDiscussing', 'wasKamal', 'wasStudentsGood', 'wasStudentsEnterOnTime', 'wasStudentsExitOnTime',
        'activityType', 'teacherToReportFor', 'wasCollectiveWatch',
        'isTaarifHulia', 'isTaarifHulia2', 'isTaarifHulia3'
    ],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    filterDefaultValues,
    importer,
};

export default getResourceComponents(entity);