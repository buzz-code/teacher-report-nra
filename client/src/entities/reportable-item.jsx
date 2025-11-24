import React from 'react';
import {
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
  FunctionField,
  DateInput,
  SelectInput,
  TextInput,
  required,
  maxLength,
  useTranslate,
  FormDataConsumer,
  useRecordContext
} from 'react-admin';
import {
  Chip,
  Stack
} from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { BulkActionButton } from '@shared/components/crudContainers/BulkActionButton';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';

const filters = [
  ...commonAdminFilters,
  <DateInput source="reportDate:$gte" alwaysOn />,
  <DateInput source="reportDate:$lte" alwaysOn />,
  <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" />,
  <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
  <SelectInput
    source="type"
    choices={[
      { id: 'report', name: 'דיווח נוכחות' },
      { id: 'answer', name: 'תשובה' }
    ]}
    alwaysOn
  />,
  <SelectInput
    source="salaryReportId:$isnull"
    choices={[
      { id: 'true', name: 'לא מוקצה' },
      { id: 'false', name: 'מוקצה' }
    ]}
  />
];

const SalaryReportAssignmentForm = () => {
  return (
    <Stack spacing={2}>
      <CommonReferenceInput
        source="existingSalaryReportId"
        reference="salary_report"
        dynamicFilter={filterByUserId}
      />

      <FormDataConsumer>
        {({ formData }) => (
          <>
            <TextInput
              source="salaryReportName"
              validate={[required(), maxLength(255)]}
              disabled={!!formData.existingSalaryReportId}
            />
            <DateInput
              source="salaryReportDate"
              validate={[required()]}
              disabled={!!formData.existingSalaryReportId}
            />
          </>
        )}
      </FormDataConsumer>
    </Stack>
  );
};

const TypeChip = ({ source }) => {
  const record = useRecordContext();
  const translate = useTranslate();

  if (!record) return null;

  const isAnswer = record.type === 'answer';
  const typeKey = isAnswer ? 'answer' : 'attendance_report';
  const typeLabel = translate(`resources.reportable_item.values.type.${typeKey}`);

  return (
    <Chip
      label={typeLabel}
      color={isAnswer ? 'secondary' : 'primary'}
      size="small"
    />
  );
};

const additionalBulkButtons = [
  <BulkActionButton
    name="assignToSalaryReport"
    label="הקצה לדוח שכר"
    icon={<AssignmentIcon />}
    reloadOnEnd
  >
    <SalaryReportAssignmentForm />
  </BulkActionButton>
];

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props} readonly additionalBulkButtons={additionalBulkButtons}>
      {children}
      {isAdmin && <TextField source="id" />}
      <FunctionField
        source="type"
        render={TypeChip}
      />
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <DateField source="reportDate" />
      <ReferenceField source="salaryReportId" reference="salary_report" />
      <BooleanField
        source="isAssigned"
        transform={(record) => !!record.salaryReportId}
      />
      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const entity = {
  Datagrid,
  filters,
  exporter: false,
  sort: { field: 'reportDate', order: 'DESC' }
};

export default getResourceComponents(entity);
