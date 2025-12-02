import React, { useState, useEffect } from 'react';
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
  useListContext,
  useDataProvider,
  TextInput,
  required,
} from 'react-admin';
import { get } from 'lodash';
import { Tooltip, IconButton, Box, Typography, Chip, CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import { calculatePriceExplanation, createPriceMap } from '../utils/priceCalculation';
import { shouldShowField, getTeacherTypeKeyByTeacherTypeId } from '../utils/attReportFields';
import { BulkActionButton } from '@shared/components/crudContainers/BulkActionButton';
import { CommonRichTextInput } from '@shared/components/fields/CommonRichTextInput';

const defaultMailSubject = "דיווחי נוכחות - {name}";
const defaultMailBody = "<p>שלום {name},</p><p>מצורף קובץ דיווחי הנוכחות שלך.</p>";

const additionalBulkButtons = [
  <BulkActionButton label='שליחת אקסל למורה' icon={<AttachEmailIcon />} name='teacherReportFile'>
    <TextInput key="mailSubject" source="mailSubject" label="נושא המייל" validate={required()} defaultValue={defaultMailSubject} />
    <CommonRichTextInput key="mailBody" source="mailBody" label="תוכן המייל" validate={required()} defaultValue={defaultMailBody} />
  </BulkActionButton>,
];

/**
 * Component to display the price paid for a specific field from priceExplanation.
 * Uses source prop for React Admin column header resolution.
 */
const FieldPriceField = ({ source, priceMap, isLoading }) => {
  const translate = useTranslate();

  return (
    <FunctionField
      source={source}
      sortable={false}
      render={(record) => {
        if (!record || isLoading || !priceMap) return null;

        const explanation = calculatePriceExplanation(record, record.teacherTypeKey, priceMap);
        const component = explanation.components.find(c => c.fieldKey === source);

        if (!component) return null;

        const currency = translate('priceExplanation.currency', { _: '₪' });
        return <span>{component.subtotal.toFixed(2)} {currency}</span>;
      }}
    />
  );
};

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
  const { filterValues } = useListContext();
  const selectedTeacherTypeId = get(filterValues, 'teacherTypeReferenceId');
  const [selectedTeacherTypeKey, setSelectedTeacherTypeKey] = useState(null);
  const dataProvider = useDataProvider();

  useEffect(() => {
    const fetchTeacherType = async () => {
      const teacherTypeKey = await getTeacherTypeKeyByTeacherTypeId(dataProvider, selectedTeacherTypeId);
      setSelectedTeacherTypeKey(teacherTypeKey);
    };

    fetchTeacherType();
  }, [dataProvider, selectedTeacherTypeId]);

  return (
    <CommonDatagrid {...props} additionalBulkButtons={additionalBulkButtons}>
      {children}
      {isAdmin && <TextField source="id" />}
      {isAdmin && <ReferenceField source="userId" reference="user" />}
      <ReferenceField source="teacherReferenceId" reference="teacher" />
      <DateField source="reportDate" />
      <DateField showDate showTime source="updateDate" />
      <SelectField source="year" choices={yearChoices} />
      <ReferenceField source="teacherTypeReferenceId" reference="teacher_type" />
      <ReferenceField source="salaryReportId" reference="salary_report" emptyText="-" />
      <TextField source="salaryMonth" />
      <TextField source="comment" />

      {/* Field-specific prices based on teacher type */}
      {/* SEMINAR_KITA, KINDERGARTEN */}
      {shouldShowField('howManyStudents', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudents" priceMap={priceMap} isLoading={isLoading} />}

      {/* SEMINAR_KITA, SPECIAL_EDUCATION */}
      {shouldShowField('howManyLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyLessons" priceMap={priceMap} isLoading={isLoading} />}

      {/* SEMINAR_KITA, PDS */}
      {shouldShowField('howManyWatchOrIndividual', selectedTeacherTypeKey) && <FieldPriceField source="howManyWatchOrIndividual" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('howManyTeachedOrInterfering', selectedTeacherTypeKey) && <FieldPriceField source="howManyTeachedOrInterfering" priceMap={priceMap} isLoading={isLoading} />}

      {/* SEMINAR_KITA, MANHA, PDS */}
      {shouldShowField('howManyDiscussingLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyDiscussingLessons" priceMap={priceMap} isLoading={isLoading} />}

      {/* SEMINAR_KITA only */}
      {shouldShowField('wasKamal', selectedTeacherTypeKey) && <FieldPriceField source="wasKamal" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('howManyLessonsAbsence', selectedTeacherTypeKey) && <FieldPriceField source="howManyLessonsAbsence" priceMap={priceMap} isLoading={isLoading} />}

      {/* MANHA only */}
      {shouldShowField('howManyMethodic', selectedTeacherTypeKey) && <FieldPriceField source="howManyMethodic" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('isTaarifHulia', selectedTeacherTypeKey) && <FieldPriceField source="isTaarifHulia" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('isTaarifHulia2', selectedTeacherTypeKey) && <FieldPriceField source="isTaarifHulia2" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('isTaarifHulia3', selectedTeacherTypeKey) && <FieldPriceField source="isTaarifHulia3" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('howManyWatchedLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyWatchedLessons" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('howManyYalkutLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyYalkutLessons" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('howManyStudentsHelpTeached', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudentsHelpTeached" priceMap={priceMap} isLoading={isLoading} />}

      {/* MANHA, SPECIAL_EDUCATION */}
      {shouldShowField('howManyStudentsTeached', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudentsTeached" priceMap={priceMap} isLoading={isLoading} />}

      {/* KINDERGARTEN only */}
      {shouldShowField('wasCollectiveWatch', selectedTeacherTypeKey) && <FieldPriceField source="wasCollectiveWatch" priceMap={priceMap} isLoading={isLoading} />}

      {/* SPECIAL_EDUCATION only */}
      {shouldShowField('howManyStudentsWatched', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudentsWatched" priceMap={priceMap} isLoading={isLoading} />}
      {shouldShowField('wasPhoneDiscussing', selectedTeacherTypeKey) && <FieldPriceField source="wasPhoneDiscussing" priceMap={priceMap} isLoading={isLoading} />}

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
  sort: { field: 'reportDate', order: 'DESC' },
};

export default getResourceComponents(entity);
