import { DateField, DateTimeInput, maxLength, NumberInput, NumberField, ReferenceField, required, TextField, TextInput } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';

const filters = [
    adminUserFilter,
    <TextInput source="code" alwaysOn />,
    <TextInput source="description" label="תיאור" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" emptyText='system' />}
            <TextField source="code" />
            <TextField source="description" />
            <NumberField source="price" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" emptyValue={0} emptyText='system' />}
        <TextInput source="code" disabled={!isCreate} validate={[required(), maxLength(100)]} />
        <TextInput source="description" disabled={!isCreate} validate={[required(), maxLength(500)]} />
        <NumberInput source="price" validate={[required()]} step={0.01} />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = 'description';

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
};

export default getResourceComponents(entity);