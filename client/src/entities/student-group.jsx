import {
  DateField,
  DateInput,
  DateTimeInput,
  maxValue,
  minValue,
  NumberField,
  NumberInput,
  ReferenceField,
  required,
  TextField,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props}>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <DateField source="startDate" />
      <DateField source="endDate" />
      <NumberField source="studentCount" />
      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const Inputs = ({ isCreate, isAdmin }) => {
  return (
    <>
      {!isCreate && isAdmin && <NumberInput source="id" disabled />}
      {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
      <CommonReferenceInput
        source="teacherReferenceId"
        reference="teacher"
        dynamicFilter={filterByUserId}
        validate={required()}
      />
      <DateInput source="startDate" validate={required()} />
      <DateInput source="endDate" />
      <NumberInput source="studentCount" validate={[required(), minValue(1), maxValue(999)]} />
      {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
      {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
  );
};

const Representation = CommonRepresentation;

const importer = {
  fields: ['teacherTz', 'startDate', 'endDate', 'studentCount'],
};

const entity = {
  Datagrid,
  Inputs,
  Representation,
  filters,
  importer,
};

export default getResourceComponents(entity);
