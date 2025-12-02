import {
  DateField,
  DateInput,
  NumberField,
  ReferenceField,
  TextField,
  FunctionField,
  useTranslate,
} from 'react-admin';
import { Tooltip, IconButton, Box, Typography, Chip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const currencyOptions = {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

/**
 * Price explanation tooltip - shows answer × tariff breakdown
 */
const PriceExplanationTooltip = () => {
  const translate = useTranslate();

  return (
    <FunctionField
      source="calculatedPrice"
      render={(record) => {
        if (!record) return null;

        const currency = translate('priceExplanation.currency', { _: '₪' });
        const price = record.calculatedPrice ?? 0;
        const answer = record.answer ?? 0;
        const tariff = record.questionTariff ?? 0;
        const questionContent = record.questionContent || translate('resources.question.name', { _: 'שאלה' });

        // Build explanation
        const explanationLines = [
          questionContent,
          `${answer} × ${currency}${tariff.toFixed(2)} = ${currency}${price.toFixed(2)}`,
        ];

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label={`${currency}${price.toFixed(2)}`} color="primary" size="small" />
            <Tooltip
              title={
                <Box sx={{ whiteSpace: 'pre-line', direction: 'rtl', textAlign: 'right' }}>
                  <Typography variant="body2" component="div">
                    {explanationLines.join('\n')}
                  </Typography>
                </Box>
              }
              arrow
              placement="left"
            >
              <IconButton size="small" sx={{ padding: 0.5 }}>
                <InfoIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }}
    />
  );
};

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
  <CommonReferenceInputFilter source="questionReferenceId" reference="question" dynamicFilter={filterByUserId} />,
  <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
  <DateInput source="reportDate:$gte" alwaysOn />,
  <DateInput source="reportDate:$lte" alwaysOn />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
  return (
    <CommonDatagrid {...props}>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <TextField source="questionContent" label="resources.question.fields.content" />
      <NumberField source="answer" />
      <NumberField source="questionTariff" label="resources.question.fields.tariff" options={currencyOptions} />
      <PriceExplanationTooltip />
      <DateField source="reportDate" />
      <ReferenceField source="salaryReportId" reference="salary_report" emptyText="-" />
      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const entity = {
  Datagrid,
  filters,
  sort: { field: 'reportDate', order: 'DESC' },
};

export default getResourceComponents(entity);
