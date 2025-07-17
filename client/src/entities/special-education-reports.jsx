import { 
    DateField, 
    DateInput, 
    DateTimeInput, 
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

// Filter for Special Education teachers (teacher type 7)
const specialEdTeacherFilter = (userFilters) => {
    return {
        ...filterByUserId(userFilters),
        'teacher.teacherTypeId': () => 7
    };
};

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={specialEdTeacherFilter} alwaysOn />,
    <DateInput source="reportDate:$gte" />,
    <DateInput source="reportDate:$lte" />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" />,
    <CommonReferenceInputFilter source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />,
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
            
            {/* Special Education specific fields */}
            <NumberField source="howManyMethodic" />
            <NumberField source="howManyStudents" />
            <NumberField source="howManyStudentsHelpTeached" />
            <BooleanField source="wasDiscussing" />
            <ReferenceField source="teacherToReportFor" reference="teacher" />
            <TextField source="comment" />
            
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherId" reference="teacher" validate={[required()]} dynamicFilter={specialEdTeacherFilter} />
        <DateInput source="reportDate" validate={[required()]} />
        <DateTimeInput source="updateDate" />
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
        <BooleanInput source="isConfirmed" />
        
        {/* Salary fields */}
        <CommonReferenceInput source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />
        <NumberInput source="salaryMonth" />
        
        {/* Special Education specific fields */}
        <NumberInput source="howManyMethodic" />
        <NumberInput source="howManyStudents" />
        <NumberInput source="howManyStudentsHelpTeached" />
        <BooleanInput source="wasDiscussing" />
        <CommonReferenceInput source="teacherToReportFor" reference="teacher" dynamicFilter={filterByUserId} />
        <TextInput source="comment" multiline />
        
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: [
        'teacherId', 'reportDate', 'updateDate', 'year', 'isConfirmed',
        'salaryReport', 'salaryMonth', 
        'howManyMethodic', 'howManyStudents', 'howManyStudentsHelpTeached', 
        'wasDiscussing', 'teacherToReportFor', 'comment'
    ],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    filterDefaultValues,
    importer,
    // Override the API endpoint to use att_report but with filtering
    basePath: 'att_report',
};

export default getResourceComponents(entity);