import React from 'react';
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
    BooleanInput,
    useRecordContext,
    useGetOne
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

// Teacher type mapping based on functional requirements
const TEACHER_TYPES = {
    1: 'TeacherType1', // Seminar Kita
    3: 'TeacherType3', // Manha
    5: 'TeacherType5', // PDS
    6: 'TeacherType6', // Kindergarten
    7: 'TeacherType7', // Special Education
};

const TEACHER_TYPE_LABELS = {
    1: 'דיווחי סמינר/קיטה',
    3: 'דיווחי מנהה',
    5: 'דיווחי PDS',
    6: 'דיווחי גן ילדים',
    7: 'דיווחי חינוך מיוחד',
};

// Helper function to get teacher type from record
const useTeacherType = () => {
    const record = useRecordContext();
    const teacherId = record?.teacherId;
    
    const { data: teacher } = useGetOne('teacher', { id: teacherId }, { enabled: !!teacherId });
    
    return teacher?.teacherTypeId;
};

// Helper function to determine resource URL based on context
const getResourceUrl = (teacherType) => {
    if (!teacherType || !TEACHER_TYPES[teacherType]) {
        return 'att_report'; // Default resource
    }
    return `att_report/pivot?extra.pivot=${TEACHER_TYPES[teacherType]}`;
};

// Component to provide teacher-type aware resource
const TeacherTypeAwareResource = ({ children, ...props }) => {
    const teacherType = useTeacherType();
    const resource = getResourceUrl(teacherType);
    
    return React.cloneElement(children, { resource, ...props });
};

// Helper function to check if field should be visible for teacher type
const isFieldVisible = (fieldName, teacherType) => {
    if (!teacherType) return true; // Show all fields if no teacher type
    
    const fieldVisibility = {
        1: { // Seminar Kita
            howManyStudents: true,
            howManyMethodic: true,
            howManyWatchedLessons: true,
            howManyStudentsHelpTeached: true,
            howManyLessonsAbsence: true,
            wasKamal: true,
            howManyDiscussingLessons: true,
            fourLastDigitsOfTeacherPhone: false,
            teachedStudentTz: false,
            howManyYalkutLessons: false,
            teacherToReportFor: false,
            isTaarifHulia: false,
            isTaarifHulia2: false,
            isTaarifHulia3: false,
        },
        3: { // Manha
            howManyMethodic: true,
            fourLastDigitsOfTeacherPhone: true,
            isTaarifHulia: true,
            isTaarifHulia2: true,
            teachedStudentTz: true,
            howManyYalkutLessons: true,
            howManyStudentsHelpTeached: true,
            howManyStudents: false,
            wasKamal: false,
            howManyDiscussingLessons: false,
            wasCollectiveWatch: false,
            wasStudentsEnterOnTime: false,
            wasStudentsExitOnTime: false,
            isTaarifHulia3: false,
        },
        5: { // PDS
            howManyWatchedLessons: true,
            howManyStudentsHelpTeached: true,
            howManyDiscussingLessons: true,
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
        },
        6: { // Kindergarten
            wasCollectiveWatch: true,
            howManyWatchedLessons: true,
            wasStudentsGood: true,
            wasStudentsEnterOnTime: true,
            wasStudentsExitOnTime: true,
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
        },
        7: { // Special Education
            howManyLessonsAbsence: true,
            howManyWatchedLessons: true,
            howManyStudentsHelpTeached: true,
            fourLastDigitsOfTeacherPhone: true,
            teacherToReportFor: true,
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
        },
    };
    
    return fieldVisibility[teacherType]?.[fieldName] !== false;
};

// Conditional Field Component
const ConditionalField = ({ children, fieldName }) => {
    const teacherType = useTeacherType();
    
    if (!isFieldVisible(fieldName, teacherType)) {
        return null;
    }
    
    return children;
};

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
    <DateInput source="reportDate:$gte" />,
    <DateInput source="reportDate:$lte" />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" />,
    <CommonReferenceInputFilter source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <ReferenceField source="teacherId" reference="teacher" />
            <DateField source="reportDate" />
            <DateField showDate showTime source="updateDate" />
            <NumberField source="year" />
            <BooleanField source="isConfirmed" />
            <ReferenceField source="salaryReport" reference="salary_report" />
            <NumberField source="salaryMonth" />
            <TextField source="comment" />
            
            {/* Conditional fields based on teacher type */}
            <ConditionalField fieldName="howManyStudents">
                <NumberField source="howManyStudents" />
            </ConditionalField>
            <ConditionalField fieldName="howManyMethodic">
                <NumberField source="howManyMethodic" />
            </ConditionalField>
            <ConditionalField fieldName="fourLastDigitsOfTeacherPhone">
                <TextField source="fourLastDigitsOfTeacherPhone" />
            </ConditionalField>
            <ConditionalField fieldName="wasDiscussing">
                <BooleanField source="wasDiscussing" />
            </ConditionalField>
            <ConditionalField fieldName="wasKamal">
                <BooleanField source="wasKamal" />
            </ConditionalField>
            <ConditionalField fieldName="wasStudentsGood">
                <BooleanField source="wasStudentsGood" />
            </ConditionalField>
            
            <ReferenceField source="activityType" reference="att_type" />
            
            <ConditionalField fieldName="isTaarifHulia">
                <BooleanField source="isTaarifHulia" />
            </ConditionalField>
            <ConditionalField fieldName="isTaarifHulia2">
                <BooleanField source="isTaarifHulia2" />
            </ConditionalField>
            <ConditionalField fieldName="isTaarifHulia3">
                <BooleanField source="isTaarifHulia3" />
            </ConditionalField>
            
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} />
        <DateInput source="reportDate" validate={[required()]} />
        <DateTimeInput source="updateDate" />
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
        <BooleanInput source="isConfirmed" />
        
        {/* Salary fields */}
        <CommonReferenceInput source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />
        <NumberInput source="salaryMonth" />
        <TextInput source="comment" multiline />
        
        {/* Conditional activity fields based on teacher type */}
        <ConditionalField fieldName="howManyStudents">
            <NumberInput source="howManyStudents" />
        </ConditionalField>
        
        <ConditionalField fieldName="howManyMethodic">
            <NumberInput source="howManyMethodic" />
        </ConditionalField>
        
        <ConditionalField fieldName="fourLastDigitsOfTeacherPhone">
            <TextInput source="fourLastDigitsOfTeacherPhone" validate={[maxLength(4)]} />
        </ConditionalField>
        
        {/* Teaching fields */}
        <ConditionalField fieldName="teachedStudentTz">
            <TextInput source="teachedStudentTz" multiline helperText="תעודות זהות של תלמידים שנלמדו" />
        </ConditionalField>
        
        <ConditionalField fieldName="howManyYalkutLessons">
            <NumberInput source="howManyYalkutLessons" />
        </ConditionalField>
        
        <ConditionalField fieldName="howManyDiscussingLessons">
            <NumberInput source="howManyDiscussingLessons" />
        </ConditionalField>
        
        {/* Assessment fields */}
        <ConditionalField fieldName="howManyStudentsHelpTeached">
            <NumberInput source="howManyStudentsHelpTeached" />
        </ConditionalField>
        
        <ConditionalField fieldName="howManyLessonsAbsence">
            <NumberInput source="howManyLessonsAbsence" />
        </ConditionalField>
        
        <ConditionalField fieldName="howManyWatchedLessons">
            <NumberInput source="howManyWatchedLessons" />
        </ConditionalField>
        
        {/* Boolean flags */}
        <ConditionalField fieldName="wasDiscussing">
            <BooleanInput source="wasDiscussing" />
        </ConditionalField>
        
        <ConditionalField fieldName="wasKamal">
            <BooleanInput source="wasKamal" />
        </ConditionalField>
        
        <ConditionalField fieldName="wasStudentsGood">
            <BooleanInput source="wasStudentsGood" />
        </ConditionalField>
        
        <ConditionalField fieldName="wasStudentsEnterOnTime">
            <BooleanInput source="wasStudentsEnterOnTime" />
        </ConditionalField>
        
        <ConditionalField fieldName="wasStudentsExitOnTime">
            <BooleanInput source="wasStudentsExitOnTime" />
        </ConditionalField>
        
        {/* Special fields */}
        <CommonReferenceInput source="activityType" reference="att_type" dynamicFilter={filterByUserId} />
        
        <ConditionalField fieldName="teacherToReportFor">
            <NumberInput source="teacherToReportFor" />
        </ConditionalField>
        
        <ConditionalField fieldName="wasCollectiveWatch">
            <BooleanInput source="wasCollectiveWatch" />
        </ConditionalField>
        
        {/* Tariff fields */}
        <ConditionalField fieldName="isTaarifHulia">
            <BooleanInput source="isTaarifHulia" />
        </ConditionalField>
        
        <ConditionalField fieldName="isTaarifHulia2">
            <BooleanInput source="isTaarifHulia2" />
        </ConditionalField>
        
        <ConditionalField fieldName="isTaarifHulia3">
            <BooleanInput source="isTaarifHulia3" />
        </ConditionalField>
        
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
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

// Teacher-Type Specific Pivot Resources
export const seminarKitaReports = getResourceComponents({
    ...entity,
    resource: 'att_report/pivot?extra.pivot=TeacherType1',
});

export const manhaReports = getResourceComponents({
    ...entity,
    resource: 'att_report/pivot?extra.pivot=TeacherType3',
});

export const pdsReports = getResourceComponents({
    ...entity,
    resource: 'att_report/pivot?extra.pivot=TeacherType5',
});

export const kindergartenReports = getResourceComponents({
    ...entity,
    resource: 'att_report/pivot?extra.pivot=TeacherType6',
});

export const specialEducationReports = getResourceComponents({
    ...entity,
    resource: 'att_report/pivot?extra.pivot=TeacherType7',
});

export const monthlyReports = getResourceComponents({
    ...entity,
    resource: 'att_report/pivot?extra.pivot=MonthlyReport',
});

export default getResourceComponents(entity);