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

// Filter for Manha teachers (teacher type 3)
const manhaTeacherFilter = (userFilters) => {
    return {
        ...filterByUserId(userFilters),
        'teacher.teacherTypeId': () => 3
    };
};

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={manhaTeacherFilter} alwaysOn />,
    <DateInput source="reportDate:$gte" />,
    <DateInput source="reportDate:$lte" />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" />,
    <CommonReferenceInputFilter source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />,
    <TextInput source="fourLastDigitsOfTeacherPhone" />,
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
            
            {/* Manha specific fields */}
            <NumberField source="howManyMethodic" />
            <TextField source="fourLastDigitsOfTeacherPhone" />
            <NumberField source="teacherToReportFor" />
            <NumberField source="howManyWatchedLessons" />
            <BooleanField source="isTaarifHulia" />
            <BooleanField source="isTaarifHulia2" />
            <NumberField source="howManyStudentsHelpTeached" />
            <TextField source="teachedStudentTz" />
            <NumberField source="howManyYalkutLessons" />
            
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherId" reference="teacher" validate={[required()]} dynamicFilter={manhaTeacherFilter} />
        <DateInput source="reportDate" validate={[required()]} />
        <DateTimeInput source="updateDate" />
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
        <BooleanInput source="isConfirmed" />
        
        {/* Salary fields */}
        <CommonReferenceInput source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />
        <NumberInput source="salaryMonth" />
        <TextInput source="comment" multiline />
        
        {/* Manha specific fields */}
        <NumberInput source="howManyMethodic" />
        <TextInput source="fourLastDigitsOfTeacherPhone" validate={[maxLength(4)]} />
        <NumberInput source="teacherToReportFor" />
        <NumberInput source="howManyWatchedLessons" />
        <BooleanInput source="isTaarifHulia" />
        <BooleanInput source="isTaarifHulia2" />
        <NumberInput source="howManyStudentsHelpTeached" />
        <TextInput source="teachedStudentTz" multiline />
        <NumberInput source="howManyYalkutLessons" />
        
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: [
        'teacherId', 'reportDate', 'updateDate', 'year', 'isConfirmed',
        'salaryReport', 'salaryMonth', 'comment',
        'howManyMethodic', 'fourLastDigitsOfTeacherPhone', 'teacherToReportFor',
        'howManyWatchedLessons', 'isTaarifHulia', 'isTaarifHulia2', 
        'howManyStudentsHelpTeached', 'teachedStudentTz', 'howManyYalkutLessons'
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