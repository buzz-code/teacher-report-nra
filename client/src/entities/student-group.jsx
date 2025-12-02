import {
  DateField,
  DateInput,
  DateTimeInput,
  maxLength,
  maxValue,
  minValue,
  NumberField,
  NumberInput,
  ReferenceField,
  required,
  SelectField,
  TextField,
  TextInput,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} />,
  <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
];

const filterDefaultValues = {
  ...defaultYearFilter,
};

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
      <TextField source="trainingTeacher" />
      <SelectField source="year" choices={yearChoices} />
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
      <TextInput source="trainingTeacher" validate={[maxLength(255)]} />
      <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
      {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
      {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
  );
};

const Representation = CommonRepresentation;

const importer = {
  fields: ['teacherTz', 'startDate', 'endDate', 'studentCount', 'trainingTeacher', 'year'],
};

const entity = {
  Datagrid,
  Inputs,
  Representation,
  filters,
  filterDefaultValues,
  importer,
};

export default getResourceComponents(entity);
