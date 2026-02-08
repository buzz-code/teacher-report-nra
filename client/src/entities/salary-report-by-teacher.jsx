import {
  DateField,
  NumberField,
  NumberInput,
  ReferenceField,
  SelectField,
  SelectInput,
  TextField,
  useRecordContext,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';

const currencyOptions = {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const monthChoices = [
  { id: 1, name: 'ינואר' },
  { id: 2, name: 'פברואר' },
  { id: 3, name: 'מרץ' },
  { id: 4, name: 'אפריל' },
  { id: 5, name: 'מאי' },
  { id: 6, name: 'יוני' },
  { id: 7, name: 'יולי' },
  { id: 8, name: 'אוגוסט' },
  { id: 9, name: 'ספטמבר' },
  { id: 10, name: 'אוקטובר' },
  { id: 11, name: 'נובמבר' },
  { id: 12, name: 'דצמבר' },
];

/**
 * Button to show related records (answers or att_reports) for this teacher + salary report.
 */
const ShowTeacherReportablesButton = ({ targetResource, label }) => {
  const record = useRecordContext();
  if (!record) return null;

  const startDate = new Date(record.reportYear, record.reportMonth - 1, 1).toISOString();
  const endDate = new Date(record.reportYear, record.reportMonth, 0, 23, 59, 59).toISOString();

  return (
    <ShowMatchingRecordsButton
      resource={targetResource}
      filter={{
        salaryReportId: record.salaryReportId,
        teacherReferenceId: record.teacherReferenceId,
        'reportDate:$gte': startDate,
        'reportDate:$lte': endDate,
      }}
      label={label}
    />
  );
};

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
  <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} />,
  <CommonAutocompleteInput source="salaryReport.year" choices={yearChoices} alwaysOn />,
  <SelectInput source="reportMonth" choices={monthChoices} />,
  <NumberInput source="reportYear" options={{ useGrouping: false }} />,
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
      <SelectField source="reportMonth" choices={monthChoices} />
      <NumberField source="reportYear" options={{ useGrouping: false }} />
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
      <ShowTeacherReportablesButton targetResource="att_report_with_price" label="דיווחים" />

      {isAdmin && <DateField showDate showTime source="salaryReport.createdAt" label="נוצר" />}
      {isAdmin && <DateField showDate showTime source="salaryReport.updatedAt" label="עודכן" />}
    </CommonDatagrid>
  );
};

const entity = {
  Datagrid,
  filters,
  filterDefaultValues,
  sort: { field: 'salaryReportId', order: 'DESC' },
};

export default getResourceComponents(entity);
