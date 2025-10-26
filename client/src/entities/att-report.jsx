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
import { BulkFixReferenceButton } from '@shared/components/crudContainers/BulkFixReferenceButton';

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
    <DateInput source="reportDate:$gte" />,
    <DateInput source="reportDate:$lte" />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    // <BooleanInput source="isConfirmed" />,
    <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    const additionalBulkButtons = [
        isAdmin && <BulkFixReferenceButton key="fixReferences" label="תיקון שיוך מורה" />
    ];

    return (
        <CommonDatagrid {...props} additionalBulkButtons={additionalBulkButtons}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <ReferenceField source="teacherReferenceId" reference="teacher" />
            <DateField source="reportDate" />
            <DateField showDate showTime source="updateDate" />
            <NumberField source="year" />
            {/* <BooleanField source="isConfirmed" /> */}
            <ReferenceField source="salaryReportId" reference="salary_report" />
            <NumberField source="salaryMonth" />
            <TextField source="comment" />
            <NumberField source="howManyStudents" />
            <NumberField source="howManyMethodic" />
            <TextField source="fourLastDigitsOfTeacherPhone" />
            <BooleanField source="wasDiscussing" />
            <BooleanField source="wasKamal" />
            <BooleanField source="wasStudentsGood" />
            <ReferenceField source="activityType" reference="att_type" />
            <BooleanField source="isTaarifHulia" />
            <BooleanField source="isTaarifHulia2" />
            <BooleanField source="isTaarifHulia3" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherReferenceId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} />
        <DateInput source="reportDate" validate={[required()]} />
        <DateTimeInput source="updateDate" />
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
        {/* <BooleanInput source="isConfirmed" /> */}

        {/* Salary fields */}
        <CommonReferenceInput source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />
        <NumberInput source="salaryMonth" />
        <TextInput source="comment" multiline />

        {/* Activity fields */}
        <NumberInput source="howManyStudents" />
        <NumberInput source="howManyMethodic" />
        <TextInput source="fourLastDigitsOfTeacherPhone" validate={[maxLength(4)]} />

        {/* Teaching fields */}
        <TextInput source="teachedStudentTz" multiline helperText="תעודות זהות של תלמידים שנלמדו" />
        <NumberInput source="howManyYalkutLessons" />
        <NumberInput source="howManyDiscussingLessons" />

        {/* Assessment fields */}
        <NumberInput source="howManyStudentsHelpTeached" />
        <NumberInput source="howManyLessonsAbsence" />
        <NumberInput source="howManyWatchedLessons" />

        {/* Boolean flags */}
        <BooleanInput source="wasDiscussing" />
        <BooleanInput source="wasKamal" />
        <BooleanInput source="wasStudentsGood" />
        <BooleanInput source="wasStudentsEnterOnTime" />
        <BooleanInput source="wasStudentsExitOnTime" />

        {/* Special fields */}
        <CommonReferenceInput source="activityType" reference="att_type" dynamicFilter={filterByUserId} />
        <NumberInput source="teacherToReportFor" />
        <BooleanInput source="wasCollectiveWatch" />

        {/* Tariff fields */}
        <BooleanInput source="isTaarifHulia" />
        <BooleanInput source="isTaarifHulia2" />
        <BooleanInput source="isTaarifHulia3" />

        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: [
        'teacherTz', 'reportDate', 'updateDate', 'year', /* 'isConfirmed', */
        'salaryReportId', 'salaryMonth', 'comment',
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