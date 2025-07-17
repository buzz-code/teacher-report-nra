import { DateField, DateTimeInput, ReferenceField, required, TextField, TextInput, maxLength, NumberInput, NumberField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { useUnique } from '@shared/utils/useUnique';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';

const filters = [
    ...commonAdminFilters,
    <TextInput source="tz" label="תעודת זהות" />,
    <TextInput source="name:$cont" alwaysOn label="שם" />,
    <TextInput source="phone" label="טלפון" />,
    <TextInput source="email" label="דואל" />,
    <TextInput source="school:$cont" label="בית ספר" />,
    <CommonReferenceInputFilter source="teacherTypeId" reference="teacher_type" dynamicFilter={filterByUserId} label="סוג מורה" />,
    <TextInput source="trainingTeacher:$cont" label="מורה מכשירה" />,
    <NumberInput source="price:$gte" label="מחיר מ-" />,
    <NumberInput source="price:$lte" label="מחיר עד-" />,
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
            <TextField source="school" label="בית ספר" sortable />
            <ReferenceField source="teacherTypeId" reference="teacher_type" label="סוג מורה" sortBy="teacher_type.name" />
            <NumberField source="price" label="מחיר לשעה" />
            <TextField source="trainingTeacher" label="מורה מכשירה" />
            <NumberField source="specialQuestion" label="שאלה מיוחדת" />
            <NumberField source="studentCount" label="מספר תלמידות" />
            {/* Admin-only fields */}
            {isAdmin && <TextField source="id" label="מזהה פנימי" />}
            {isAdmin && <ReferenceField source="userId" reference="user" label="משתמש" />}
            {isAdmin && <ReferenceField source="ownUserId" reference="user" label="משתמש משויך" />}
            {isAdmin && <DateField showDate showTime source="createdAt" label="נוצר ב-" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" label="עודכן ב-" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    const unique = useUnique();
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled label="מזהה פנימי" />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} label="משתמש" />}
        {isAdmin && <CommonReferenceInput source="ownUserId" reference="user" dynamicFilter={filterByUserId} label="משתמש משויך" />}
        <TextInput source="tz" validate={[required(), maxLength(9), unique()]} label="תעודת זהות" />
        <TextInput source="name" validate={[required(), maxLength(255)]} label="שם" />
        <TextInput source="phone" validate={[maxLength(50)]} label="טלפון" />
        <TextInput source="email" validate={[maxLength(255)]} label="דואל" />
        <TextInput source="school" validate={[maxLength(255)]} label="בית ספר" />
        <CommonReferenceInput source="teacherTypeId" reference="teacher_type" dynamicFilter={filterByUserId} label="סוג מורה" />
        <NumberInput source="price" step={0.01} label="מחיר לשעה" />
        <TextInput source="trainingTeacher" validate={[maxLength(255)]} label="מורה מכשירה" />
        <NumberInput source="specialQuestion" label="שאלה מיוחדת" />
        <NumberInput source="studentCount" label="מספר תלמידות" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['tz', 'name', 'phone', 'email', 'school', 'teacherTypeId', 'price', 'trainingTeacher', 'specialQuestion', 'studentCount'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
    // Allow deletion only for admin users for sensitive teacher data
    deleteResource: 'teacher', // This will be used by CommonDatagrid for BulkDeleteWithConfirmButton
};

export default getResourceComponents(entity);
