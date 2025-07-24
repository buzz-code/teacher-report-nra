import { useState, useMemo } from 'react';
import { 
    DateInput, 
    NumberField, 
    TextField, 
    ReferenceField, 
    SelectField, 
    TextInput, 
    BooleanInput,
    BooleanField,
    DateField,
    SelectInput,
    useDataProvider,
    useNotify
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { MultiReferenceField } from '@shared/components/fields/CommonReferenceField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

// Teacher type choices based on fieldsShow.util.ts
const teacherTypeChoices = [
    { id: 1, name: 'סמינר כיתה' },
    { id: 3, name: 'מנהלה' },
    { id: 5, name: 'פדס' },
    { id: 6, name: 'גננת' },
    { id: 7, name: 'חינוך מיוחד' },
];

const filters = [
    ({ isAdmin }) => isAdmin && <CommonReferenceInputFilter source="userId" reference="user" />,
    <DateInput source="reportDate:$gte" label="תאריך דיווח אחרי" alwaysOn />,
    <DateInput source="reportDate:$lte" label="תאריך דיווח לפני" alwaysOn />,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <SelectInput source="teacherTypeId" choices={teacherTypeChoices} label="סוג מורה" alwaysOn />,
    <BooleanInput source="isConfirmed" label="מאושר" />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
    teacherTypeId: 1, // Default to SEMINAR_KITA
};

// Field label mapping for Hebrew translations
const fieldLabels = {
    id: 'מזהה',
    userId: 'משתמש',
    teacherId: 'מורה',
    reportDate: 'תאריך דיווח',
    year: 'שנה',
    howManyStudents: 'כמה תלמידות',
    howManyLessons: 'כמה שיעורים',
    howManyMethodic: 'כמה מתודיקה',
    howManyWatchOrIndividual: 'כמה צפייה או פרטני',
    howManyTeachedOrInterfering: 'כמה לימוד או מתערב',
    wasKamal: 'היה כמל',
    howManyDiscussingLessons: 'כמה שיעורי דיון',
    howManyLessonsAbsence: 'כמה שיעורי היעדרות',
    fourLastDigitsOfTeacherPhone: '4 ספרות אחרונות של טלפון',
    isTaarifHulia: 'תעריף חוליה',
    isTaarifHulia2: 'תעריף חוליה 2',
    isTaarifHulia3: 'תעריף חוליה 3',
    howManyWatchedLessons: 'כמה שיעורי צפייה',
    howManyStudentsTeached: 'כמה תלמידות נלמדו',
    howManyYalkutLessons: 'כמה שיעורי ילקוט',
    howManyStudentsHelpTeached: 'כמה תלמידות עזרו ללמד',
    teacherToReportFor: 'מורה לדווח עליה',
    wasCollectiveWatch: 'היתה צפייה קבוצתית',
    wasStudentsGood: 'התלמידות היו טובות',
    howManyStudentsWatched: 'כמה תלמידות נצפו',
    wasPhoneDiscussing: 'היה דיון טלפוני',
    whatIsYourSpeciality: 'מה ההתמחות שלך',
    price: 'מחיר',
    comment: 'הערה',
    isConfirmed: 'מאושר',
    activityType: 'סוג פעילות',
};

// Component to render field based on type
const renderField = (fieldName, source) => {
    switch (fieldName) {
        case 'reportDate':
            return <DateField source={source} key={source} />;
        case 'year':
            return <SelectField source={source} choices={yearChoices} key={source} />;
        case 'teacherId':
            return <MultiReferenceField source={source} sortBy="teacher.name" reference="teacher" key={source} />;
        case 'userId':
            return <ReferenceField source={source} reference="user" key={source} />;
        case 'activityType':
            return <ReferenceField source={source} reference="att_type" key={source} />;
        case 'price':
            return (
                <NumberField 
                    source={source}
                    key={source}
                    sortable={false}
                    options={{ 
                        style: 'currency', 
                        currency: 'ILS', 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                    }}
                />
            );
        case 'wasKamal':
        case 'wasCollectiveWatch':
        case 'wasStudentsGood':
        case 'wasPhoneDiscussing':
        case 'isTaarifHulia':
        case 'isTaarifHulia2':
        case 'isTaarifHulia3':
        case 'isConfirmed':
            return <BooleanField source={source} key={source} />;
        case 'howManyStudents':
        case 'howManyLessons':
        case 'howManyMethodic':
        case 'howManyWatchOrIndividual':
        case 'howManyTeachedOrInterfering':
        case 'howManyDiscussingLessons':
        case 'howManyLessonsAbsence':
        case 'howManyWatchedLessons':
        case 'howManyStudentsTeached':
        case 'howManyYalkutLessons':
        case 'howManyStudentsHelpTeached':
        case 'teacherToReportFor':
        case 'howManyStudentsWatched':
            return <NumberField source={source} key={source} />;
        default:
            return <TextField source={source} key={source} />;
    }
};

const Datagrid = ({ isAdmin, children, data, ...props }) => {
    // Extract visible fields from metadata of first record
    const visibleFields = useMemo(() => {
        if (data && data.length > 0 && data[0]._meta) {
            return data[0]._meta.visibleFields;
        }
        // Fallback to basic fields if no metadata
        return ['id', 'teacherId', 'reportDate', 'year', 'howManyStudents', 'howManyLessons', 'price', 'comment'];
    }, [data]);

    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && visibleFields.includes('id') && renderField('id', 'id')}
            {isAdmin && visibleFields.includes('userId') && renderField('userId', 'userId')}
            
            {/* Render fields dynamically based on teacher type */}
            {visibleFields.map(fieldName => {
                // Skip admin-only fields that were already rendered
                if ((fieldName === 'id' || fieldName === 'userId') && isAdmin) {
                    return null;
                }
                
                return renderField(fieldName, fieldName);
            })}
        </CommonDatagrid>
    );
}

const entity = {
    resource: 'att_report/pivot?extra.pivot=AttReportByTeacherType',
    Datagrid,
    filters,
    filterDefaultValues,
};

export default getResourceComponents(entity).list;