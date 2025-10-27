import { DateField, DateTimeInput, ReferenceField, required, TextField, TextInput, maxLength, NumberInput, NumberField } from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { useUnique } from '@shared/utils/useUnique';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { BulkActionButton } from '@shared/components/crudContainers/BulkActionButton';
import AssignmentIcon from '@mui/icons-material/Assignment';

const filters = [
    ...commonAdminFilters,
    <TextInput source="tz" />,
    <TextInput source="name:$cont" alwaysOn />,
    <TextInput source="phone" />,
    <TextInput source="email" />,
    <TextInput source="school:$cont" />,
    <CommonReferenceInputFilter source="teacherTypeReferenceId" reference="teacher_type" dynamicFilter={filterByUserId} />,
];

const additionalBulkButtons = [
  <BulkActionButton
    name="bulkAssignQuestion"
    label="שיוך שאלה"
    icon={<AssignmentIcon />}
  >
    <CommonReferenceInput
      source="questionId"
      reference="question"
      label="שאלה לשיוך"
      dynamicFilter={filterByUserId}
      validate={required()}
      sort={{ field: 'content', order: 'ASC' }}
      filterToQuery={searchText => ({ 'content:$contL': searchText })}
    />
  </BulkActionButton>
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props} additionalBulkButtons={additionalBulkButtons}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            {isAdmin && <ReferenceField source="ownUserId" reference="user" />}
            <TextField source="tz" />
            <TextField source="name" />
            <TextField source="phone" />
            <TextField source="email" />
            <TextField source="school" />
            <ReferenceField source="teacherTypeReferenceId" reference="teacher_type" />
            <TextField source="trainingTeacher" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    const unique = useUnique();
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        {isAdmin && <CommonReferenceInput source="ownUserId" reference="user" dynamicFilter={filterByUserId} />}
        <TextInput source="tz" validate={[maxLength(9)]} />
        <TextInput source="name" validate={[required(), maxLength(255)]} />
        <TextInput source="phone" validate={[maxLength(50)]} />
        <TextInput source="email" validate={[maxLength(255)]} />
        <TextInput source="school" validate={[maxLength(255)]} />
        <CommonReferenceInput source="teacherTypeReferenceId" reference="teacher_type" dynamicFilter={filterByUserId} />
        <TextInput source="trainingTeacher" validate={[maxLength(255)]} />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['tz', 'name', 'phone', 'email', 'school', 'teacherTypeKey', 'trainingTeacher'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);
