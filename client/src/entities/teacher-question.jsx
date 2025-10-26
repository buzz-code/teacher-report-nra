import {
  DateField,
  DateTimeInput,
  ReferenceField,
  required,
  TextField,
  BooleanField,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInputFilter
    source="teacherReferenceId"
    reference="teacher"
    dynamicFilter={filterByUserId}
  />,
  <CommonReferenceInputFilter
    source="questionReferenceId"
    reference="question"
    dynamicFilter={filterByUserId}
  />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props}>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <ReferenceField source="questionReferenceId" reference="question" />
      <ReferenceField source="answerReferenceId" reference="answer" />
      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const Inputs = ({ isCreate, isAdmin }) => {
  return (
    <>
      {!isCreate && isAdmin && <TextField source="id" disabled />}
      {isAdmin && (
        <CommonReferenceInput source="userId" reference="user" validate={required()} />
      )}
      <CommonReferenceInput
        source="teacherReferenceId"
        reference="teacher"
        dynamicFilter={filterByUserId}
        validate={required()}
      />
      <CommonReferenceInput
        source="questionReferenceId"
        reference="question"
        dynamicFilter={filterByUserId}
        validate={required()}
        sort={{ field: 'content', order: 'ASC' }}
        filterToQuery={searchText => ({ 'content:$contL': searchText })}
      />
      {!isCreate && (
        <CommonReferenceInput
          source="answerReferenceId"
          reference="answer"
          dynamicFilter={{ ...filterByUserId, 'teacherReferenceId': 'teacherReferenceId' }}
          disabled={!isAdmin}
          sort={{ field: 'answer', order: 'ASC' }}
          filterToQuery={searchText => ({ 'answer:$contL': searchText })}
        />
      )}
      {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
      {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
  );
};

const Representation = (record) => {
  if (!record) return null;
  return `${record.teacherReferenceId} - ${record.questionReferenceId}`;
};

const entity = {
  Datagrid,
  Inputs,
  Representation,
  filters,
};

export default getResourceComponents(entity);
