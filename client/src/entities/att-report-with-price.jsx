import React from 'react';
import {
  TextField,
  DateField,
  ReferenceField,
  DateInput,
  FunctionField,
  useTranslate,
  useGetList,
  useGetIdentity,
  SelectField,
} from 'react-admin';
import { Tooltip, IconButton, Box, Typography, Chip, CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import { calculatePriceExplanation, createPriceMap } from '../utils/priceCalculation';

const filters = [
  ...commonAdminFilters,
  <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
  <DateInput source="reportDate:$gte" alwaysOn />,
  <DateInput source="reportDate:$lte" alwaysOn />,
  <CommonReferenceInputFilter
    source="teacherTypeReferenceId"
    reference="teacher_type"
    label="סוג מורה"
    dynamicFilter={filterByUserId}
  />,
  <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
  <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
];

const filterDefaultValues = {
  ...defaultYearFilter,
};

/**
 * Hook to fetch user prices for explanation calculation.
 * Fetches prices from price_by_user resource.
 */
const usePriceMap = () => {
  const { data: identity } = useGetIdentity();
  const userId = identity?.id;

  const { data: prices, isLoading } = useGetList(
    'price_by_user',
    {
      filter: { userId },
      pagination: { page: 1, perPage: 100 },
    },
    { enabled: !!userId },
  );

  const priceMap = React.useMemo(() => createPriceMap(prices), [prices]);

  return { priceMap, isLoading };
};

/**
 * Price explanation tooltip component.
 * Calculates and displays detailed breakdown of pricing.
 */
const PriceExplanationTooltip = ({ priceMap, isLoading }) => {
  const translate = useTranslate();

  return (
    <FunctionField
      source="calculatedPrice"
      render={(record) => {
        if (!record) return null;

        const currency = translate('priceExplanation.currency', { _: '₪' });
        const price = record.calculatedPrice ?? 0;

        // Show loading state
        if (isLoading) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label={`${currency}${price.toFixed(2)}`} color="primary" size="small" />
              <CircularProgress size={16} />
            </Box>
          );
        }

        // Calculate explanation using the price map
        const explanation = calculatePriceExplanation(record, record.teacherTypeKey, priceMap);

        // Build explanation lines
        const explanationLines = [];

        // Base price
        if (explanation.basePrice > 0) {
          explanationLines.push(
            `${translate('priceExplanation.basePrice', { _: 'תעריף בסיס' })}: ${currency}${explanation.basePrice.toFixed(2)}`,
          );
        }

        // Components - use att_report field translations
        explanation.components.forEach((comp) => {
          const label = translate(`resources.att_report.fields.${comp.fieldKey}`, { _: comp.fieldKey });
          if (comp.isBonus) {
            explanationLines.push(`${label}: ${currency}${comp.subtotal.toFixed(2)}`);
          } else {
            const factorStr = comp.factor ? ` × ${comp.factor}` : '';
            explanationLines.push(
              `${label}: ${comp.value} × ${currency}${comp.multiplier.toFixed(2)}${factorStr} = ${currency}${comp.subtotal.toFixed(2)}`,
            );
          }
        });

        // Total
        if (explanationLines.length > 0) {
          explanationLines.push('─────────────────');
        }
        explanationLines.push(`${translate('priceExplanation.total', { _: 'סה"כ' })}: ${currency}${price.toFixed(2)}`);

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

const Datagrid = ({ isAdmin, children, ...props }) => {
  const { priceMap, isLoading } = usePriceMap();

  return (
    <CommonDatagrid {...props} readonly>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <DateField source="reportDate" />
      <SelectField source="year" choices={yearChoices} />
      <ReferenceField source="teacherTypeReferenceId" reference="teacher_type" />
      <ReferenceField source="salaryReportId" reference="salary_report" emptyText="-" />
      <PriceExplanationTooltip priceMap={priceMap} isLoading={isLoading} />
      {isAdmin && <DateField showDate showTime source="createdAt" />}
      {isAdmin && <DateField showDate showTime source="updatedAt" />}
    </CommonDatagrid>
  );
};

const entity = {
  Datagrid,
  filters,
  filterDefaultValues,
  exporter: true,
  sort: { field: 'reportDate', order: 'DESC' },
};

export default getResourceComponents(entity);
