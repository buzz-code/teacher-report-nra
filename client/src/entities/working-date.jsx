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
    <CommonReferenceInputFilter source="teacherTypeId" reference="teacher_type" dynamicFilter={filterByUserId} label="סוג מורה" />,
    <DateInput source="workingDate:$gte" label="תאריך עבודה מ-" />,
    <DateInput source="workingDate:$lte" label="תאריך עבודה עד-" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {/* Show meaningful identifiers */}
            <ReferenceField source="teacherTypeId" reference="teacher_type" label="סוג מורה" sortBy="teacher_type.name" />
            <DateField source="workingDate" label="תאריך עבודה" sortable />
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
        <DateInput source="workingDate" validate={[required()]} label="תאריך עבודה" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled label="נוצר ב-" />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled label="עודכן ב-" />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['teacherTypeId', 'workingDate'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);