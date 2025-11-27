import {
  DateField,
  DateInput,
  NumberField,
  ReferenceField,
  SelectField,
  TextField,
  TextInput,
  useRecordContext,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';

const currencyOptions = {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const ShowTeacherReportablesButton = ({ targetResource, label }) => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <ShowMatchingRecordsButton
      resource={targetResource}
      filter={{
        salaryReportId: record.salaryReportId,
        teacherReferenceId: record.teacherReferenceId,
      }}
      label={label}
    />
  );
};

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInput source="salaryReportId" reference="salary_report" />,
  <CommonReferenceInput source="teacherReferenceId" reference="teacher" />,
  <CommonAutocompleteInput source="salaryReport.year" choices={yearChoices} alwaysOn />,
];

const filterDefaultValues = {
  'salaryReport.year': defaultYearFilter.year,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props}>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="salaryReportId" reference="salary_report" link="show" />
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <TextField source="salaryReport.name" label="שם דוח" />
      <DateField source="salaryReport.date" label="תאריך" />
      <SelectField source="salaryReport.year" choices={yearChoices} label="שנה" />

      {/* Item counts */}
      <NumberField source="answerCount" />
      <NumberField source="attReportCount" />

      {/* Payment totals */}
      <NumberField source="answersTotal" options={currencyOptions} />
      <NumberField source="attReportsTotal" options={currencyOptions} />
      <NumberField source="grandTotal" options={currencyOptions} sx={{ fontWeight: 'bold' }} />

      {/* Show matching records buttons */}
      <ShowTeacherReportablesButton targetResource="answer" label="תשובות" />
      <ShowTeacherReportablesButton targetResource="att_report" label="דיווחים" />

      {isAdmin && <DateField showDate showTime source="salaryReport.createdAt" label="נוצר" />}
      {isAdmin && <DateField showDate showTime source="salaryReport.updatedAt" label="עודכן" />}
    </CommonDatagrid>
  );
};

const entity = {
  resource: 'salary_report_by_teacher/pivot?extra.pivot=WithTotals',
  Datagrid,
  filters,
  filterDefaultValues,
};

export default getResourceComponents(entity).list;
