import {
  DateInput,
  TextField,
  useListContext
} from 'react-admin';
import { CommonDatagrid, getPivotColumns } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';

const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

const filters = [
  <CommonReferenceInputFilter
    source="teacherTypeReferenceId"
    reference="teacher_type"
    alwaysOn
    dynamicFilter={filterByUserId}
  />,
  <DateInput source="extra.startDate" label="מתאריך" alwaysOn />,
  <DateInput source="extra.endDate" label="עד תאריך" alwaysOn />,
];

const filterDefaultValues = {
  extra: {
    startDate: firstDay,
    endDate: lastDay
  },
};

const Datagrid = ({ isAdmin, children, ...props }) => {
  const { data } = useListContext();
  return (
    <CommonDatagrid {...props}>
      {children}
      <TextField source="name" />
      {getPivotColumns(data)}
    </CommonDatagrid>
  );
}

const entity = {
  resource: 'teacher/pivot?extra.pivot=TeacherValidation',
  Datagrid,
  filters,
  filterDefaultValues,
  configurable: false
};

export default getResourceComponents(entity).list;
