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
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
    ...commonAdminFilters,
    <NumberInput source="teacherTypeId" />,
    <DateInput source="workingDate:$gte" />,
    <DateInput source="workingDate:$lte" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <NumberField source="teacherTypeId" />
            <DateField source="workingDate" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <NumberInput source="teacherTypeId" />
        <DateInput source="workingDate" validate={[required()]} />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
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