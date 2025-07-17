import { 
    DateField, 
    DateInput, 
    DateTimeInput, 
    NumberInput, 
    NumberField, 
    ReferenceField, 
    required, 
    TextField, 
    TextInput 
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} label="מורה" />,
    <CommonReferenceInputFilter source="questionId" reference="question" dynamicFilter={filterByUserId} label="שאלה" />,
    <CommonReferenceInputFilter source="reportId" reference="att_report" dynamicFilter={filterByUserId} label="דוח" />,
    <NumberInput source="answer" label="תשובה" />,
    <DateInput source="answerDate:$gte" label="תאריך תשובה מ-" />,
    <DateInput source="answerDate:$lte" label="תאריך תשובה עד-" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Show meaningful identifiers */}
            <ReferenceField source="teacherId" reference="teacher" label="מורה" sortBy="teacher.name" />
            <ReferenceField source="questionId" reference="question" label="שאלה" sortBy="question.content" />
            <NumberField source="answer" label="תשובה" sortable />
            <DateField source="answerDate" label="תאריך תשובה" sortable />
            <ReferenceField source="reportId" reference="att_report" label="דוח" />
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
        <CommonReferenceInput source="questionId" reference="question" validate={[required()]} dynamicFilter={filterByUserId} label="שאלה" />
        <CommonReferenceInput source="reportId" reference="att_report" dynamicFilter={filterByUserId} label="דוח" />
        <NumberInput source="answer" validate={[required()]} label="תשובה" />
        <DateInput source="answerDate" label="תאריך תשובה" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['teacherId', 'questionId', 'reportId', 'answer', 'answerDate'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);