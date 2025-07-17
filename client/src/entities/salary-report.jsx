import { 
    DateField, 
    DateInput,
    DateTimeInput, 
    maxLength, 
    ReferenceField, 
    required, 
    TextField, 
    TextInput 
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="name:$cont" alwaysOn label="שם" />,
    <DateInput source="date:$gte" label="תאריך מ-" />,
    <DateInput source="date:$lte" label="תאריך עד-" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Show name as primary identifier */}
            <TextField source="name" label="שם" sortable />
            <DateField showDate showTime source="date" label="תאריך" sortable />
            <TextField source="ids" label="מזהי דוחות" />
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
        <TextInput source="name" validate={[maxLength(255)]} label="שם" />
        <DateInput source="date" validate={[required()]} label="תאריך" />
        <TextInput source="ids" multiline helperText="מזהי דוחות, מופרדים בפסיק" label="מזהי דוחות" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['ids', 'date', 'name'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);