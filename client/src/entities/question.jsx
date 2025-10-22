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
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="content:$cont" alwaysOn />,
    <CommonReferenceInputFilter source="teacherTypeReferenceId" reference="teacher_type" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="questionTypeReferenceId" reference="question_type" dynamicFilter={filterByUserId} />,
    <BooleanInput source="isStandalone" />,
    <DateInput source="startDate:$gte" />,
    <DateInput source="endDate:$lte" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <ReferenceField source="teacherTypeReferenceId" reference="teacher_type" />
            <ReferenceField source="questionTypeReferenceId" reference="question_type" />
            <TextField source="content" />
            <TextField source="allowedDigits" />
            <BooleanField source="isStandalone" />
            <DateField source="startDate" />
            <DateField source="endDate" />
            <DateField source="effectiveDate" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherTypeReferenceId" reference="teacher_type" dynamicFilter={filterByUserId} />
        <CommonReferenceInput source="questionTypeReferenceId" reference="question_type" dynamicFilter={filterByUserId} />
        <TextInput source="content" validate={[required()]} multiline />
        <TextInput source="allowedDigits" validate={[maxLength(255)]} helperText="רשימת ספרות מותרות, מופרדות בפסיק" />
        <BooleanInput source="isStandalone" />
        <DateInput source="startDate" />
        <DateInput source="endDate" />
        <DateInput source="effectiveDate" helperText="התאריך שיירשם בטבלת התשובות (לצורך דוח שכר)" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = 'content';

const importer = {
    fields: ['teacherTypeKey', 'questionTypeKey', 'content', 'allowedDigits', 'isStandalone', 'startDate', 'endDate', 'effectiveDate'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);