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
    <TextInput source="content:$cont" alwaysOn label="תוכן השאלה" />,
    <CommonReferenceInputFilter source="teacherTypeId" reference="teacher_type" dynamicFilter={filterByUserId} label="סוג מורה" />,
    <CommonReferenceInputFilter source="questionTypeId" reference="question_type" dynamicFilter={filterByUserId} label="סוג שאלה" />,
    <BooleanInput source="isStandalone" label="שאלה עצמאית" />,
    <DateInput source="startDate:$gte" label="תאריך התחלה מ-" />,
    <DateInput source="endDate:$lte" label="תאריך סיום עד-" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Show content as primary identifier */}
            <TextField source="content" label="תוכן השאלה" sortable />
            <ReferenceField source="teacherTypeId" reference="teacher_type" label="סוג מורה" sortBy="teacher_type.name" />
            <ReferenceField source="questionTypeId" reference="question_type" label="סוג שאלה" sortBy="question_type.name" />
            <TextField source="allowedDigits" label="ספרות מותרות" />
            <BooleanField source="isStandalone" label="שאלה עצמאית" />
            <DateField source="startDate" label="תאריך התחלה" />
            <DateField source="endDate" label="תאריך סיום" />
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
        <CommonReferenceInput source="teacherTypeId" reference="teacher_type" dynamicFilter={filterByUserId} label="סוג מורה" />
        <CommonReferenceInput source="questionTypeId" reference="question_type" dynamicFilter={filterByUserId} label="סוג שאלה" />
        <TextInput source="content" validate={[required()]} multiline label="תוכן השאלה" />
        <TextInput source="allowedDigits" validate={[maxLength(255)]} helperText="רשימת ספרות מותרות, מופרדות בפסיק" label="ספרות מותרות" />
        <BooleanInput source="isStandalone" label="שאלה עצמאית" />
        <DateInput source="startDate" label="תאריך התחלה" />
        <DateInput source="endDate" label="תאריך סיום" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['teacherTypeId', 'questionTypeId', 'content', 'allowedDigits', 'isStandalone', 'startDate', 'endDate'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);