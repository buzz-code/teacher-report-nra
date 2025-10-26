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
    TextInput
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';

const questionSortBy = { field: 'content', order: 'ASC' };

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
            <ReferenceField source="questionId" reference="question" />
            <ReferenceField source="salaryReportId" reference="salary_report" />
            <NumberField source="answer" />
            <FunctionField
                label="resources.answer.fields.calculatedPayment"
                render={record => {
                    const payment = record.answer * (record.question?.tariff || 0);
                    return payment ? `₪${payment.toFixed(2)}` : '-';
                }}
            />
            <DateField source="reportDate" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherReferenceId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} />
        <CommonReferenceInput source="questionId" reference="question" validate={[required()]} dynamicFilter={filterByUserId} sort={questionSortBy} />
        <CommonReferenceInput source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />
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