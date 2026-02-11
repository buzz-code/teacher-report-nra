import {
    DateField,
    DateInput,
    DateTimeInput,
    FunctionField,
    NumberInput,
    NumberField,
    ReferenceField,
    required,
    TextField,
    TextInput,
    useRecordContext
} from 'react-admin';
import { Tooltip, IconButton, Box, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const questionSortBy = { field: 'content', order: 'ASC' };

/**
 * Calculate payment based on answer and question tariff
 * @param {Object} record - The answer record
 * @returns {number} - Calculated payment amount
 */
const calculatePayment = (record) => {
  if (!record || !record.answer) return 0;
  const tariff = record.question?.tariff || 0;
  return record.answer * tariff;
};

/**
 * Build payment explanation text for tooltip
 * @param {Object} record - The answer record
 * @returns {string} - Formatted explanation text
 */
const buildPaymentExplanation = (record) => {
  if (!record || !record.answer) return '';
  
  const answer = record.answer;
  const tariff = record.question?.tariff || 0;
  const payment = calculatePayment(record);
  const questionContent = record.question?.content || 'שאלה';

  return `${questionContent}\n${answer} × ₪${tariff.toFixed(2)} = ₪${payment.toFixed(2)}`;
};

/**
 * Component to display payment explanation as a tooltip
 */
const PaymentExplanationField = () => {
  const record = useRecordContext();
  
  if (!record || !record.answer) return null;

  const explanationText = buildPaymentExplanation(record);

  return (
    <Tooltip
      title={
        <Box sx={{ whiteSpace: 'pre-line', direction: 'rtl', textAlign: 'right' }}>
          <Typography variant="body2" component="div">
            {explanationText}
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
  );
};

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="questionId" reference="question" dynamicFilter={filterByUserId} sort={questionSortBy} />,
    <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
    <NumberInput source="answer" />,
    <DateInput source="reportDate:$gte" />,
    <DateInput source="reportDate:$lte" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <ReferenceField source="teacherReferenceId" reference="teacher" />
            <ReferenceField source="questionId" reference="question">
              <TextField source="content" />
            </ReferenceField>
            <ReferenceField source="salaryReportId" reference="salary_report" />
            <NumberField source="answer" />
            <FunctionField
                label="resources.answer.fields.calculatedPayment"
                render={record => {
                    const payment = calculatePayment(record);
                    return payment ? `₪${payment.toFixed(2)}` : '-';
                }}
            />
            <PaymentExplanationField />
            <DateField source="reportDate" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    const record = useRecordContext();
    const salaryReportId = record?.salaryReportId;
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherReferenceId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} />
        <CommonReferenceInput source="questionId" reference="question" validate={[required()]} dynamicFilter={filterByUserId} sort={questionSortBy} />
        <CommonReferenceInput source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} disabled={!isAdmin && salaryReportId} />
        <NumberInput source="answer" validate={[required()]} />
        <DateInput source="reportDate" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = (record) => {
  if (!record) return null;
  return `${record.reportDate} - ${record.answer}`;
};

const importer = {
    fields: ['teacherTz', 'questionId', 'salaryReportId', 'answer', 'reportDate'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);