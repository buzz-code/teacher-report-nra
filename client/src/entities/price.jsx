import { DateField, DateTimeInput, maxLength, NumberInput, NumberField, ReferenceField, required, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <NumberInput source="key" label="מזהה" />,
    <NumberInput source="price:$gte" label="מחיר מ-" />,
    <NumberInput source="price:$lte" label="מחיר עד-" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Show key as primary identifier */}
            <NumberField source="key" label="מזהה" sortable />
            <NumberField source="price" label="מחיר" sortable />
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
        <NumberInput source="key" validate={[required()]} label="מזהה" />
        <NumberInput source="price" validate={[required()]} step={0.01} label="מחיר" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['key', 'price'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);