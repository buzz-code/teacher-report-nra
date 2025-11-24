import {
  DateField,
  DateInput,
  NumberField,
  ReferenceField,
  SelectField,
  TextField,
  TextInput,
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
  ...commonAdminFilters,
  <TextInput source="name:$cont" alwaysOn />,
  <DateInput source="date:$gte" />,
  <DateInput source="date:$lte" />,
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
      <DateField showDate showTime source="date" />
      <TextField source="name" />
      <SelectField source="year" choices={yearChoices} />

      {/* Item counts */}
      <NumberField source="answerCount" />
      <NumberField source="attReportCount" />

      {/* Payment totals */}
      <NumberField
        source="answersTotal"
        options={{
          style: 'currency',
          currency: 'ILS',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }}
      />
      <NumberField
        source="attReportsTotal"
        options={{
          style: 'currency',
          currency: 'ILS',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }}
      />
      <NumberField
        source="grandTotal"
        options={{
          style: 'currency',
          currency: 'ILS',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }}
        sx={{ fontWeight: 'bold' }}
      />

      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
}

const entity = {
  resource: 'salary_report/pivot?extra.pivot=SalaryReportWithTotals',
  Datagrid,
  filters,
  filterDefaultValues,
};

export default getResourceComponents(entity).list;
