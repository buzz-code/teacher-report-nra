import { DateField, DateTimeInput, Labeled, maxLength, ReferenceField, required, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { useUnique } from '@shared/utils/useUnique';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { MultiReferenceField } from '@shared/components/fields/CommonReferenceField';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="tz" label="תעודת זהות" />,
    <TextInput source="name:$cont" alwaysOn label="שם" />,
    <TextInput source="phone" label="טלפון" />,
    <TextInput source="email" label="דואל" />,
    <TextInput source="address:$cont" label="כתובת" />,
    <TextInput source="motherName:$cont" label="שם האם" />,
    <TextInput source="motherContact:$cont" label="יצירת קשר עם האם" />,
    <TextInput source="fatherName:$cont" label="שם האב" />,
    <TextInput source="fatherContact:$cont" label="יצירת קשר עם האב" />,
    <TextInput source="motherPreviousName:$cont" label="שם משפחה קודם של האם" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Hide internal ID, show meaningful identifier */}
            <TextField source="tz" label="תעודת זהות" sortable />
            <TextField source="name" label="שם" sortable />
            <TextField source="phone" label="טלפון" />
            <TextField source="email" label="דואל" />
            <TextField source="address" label="כתובת" />
            <TextField source="motherName" label="שם האם" />
            <TextField source="motherContact" label="יצירת קשר עם האם" />
            <TextField source="fatherName" label="שם האב" />
            <TextField source="fatherContact" label="יצירת קשר עם האב" />
            <TextField source="motherPreviousName" label="שם משפחה קודם של האם" />
            {/* Admin-only fields */}
            {isAdmin && <TextField source="id" label="מזהה פנימי" />}
            {isAdmin && <ReferenceField source="userId" reference="user" label="משתמש" />}
            {isAdmin && <DateField showDate showTime source="createdAt" label="נוצר ב-" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" label="עודכן ב-" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    const unique = useUnique();

    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <TextInput source="tz" validate={[required(), maxLength(9), unique()]} />
        <TextInput source="name" validate={[required(), maxLength(510)]} />
        <TextInput source="phone" validate={[maxLength(50)]} />
        <TextInput source="email" validate={[maxLength(255)]} />
        <TextInput source="address" validate={[maxLength(1000)]} multiline />
        <TextInput source="motherName" validate={[maxLength(255)]} />
        <TextInput source="motherContact" validate={[maxLength(255)]} />
        <TextInput source="fatherName" validate={[maxLength(255)]} />
        <TextInput source="fatherContact" validate={[maxLength(255)]} />
        <TextInput source="motherPreviousName" validate={[maxLength(255)]} />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['tz', 'name', 'phone', 'email', 'address', 'motherName', 'motherContact', 'fatherName', 'fatherContact', 'motherPreviousName'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
    // Allow deletion only for admin users for sensitive student data
    deleteResource: 'student',
};

export default getResourceComponents(entity);
