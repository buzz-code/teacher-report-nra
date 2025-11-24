import {
    DateField,
    DateInput,
    DateTimeInput,
    maxLength,
    NumberField,
    ReferenceField,
    required,
    SelectField,
    TextField,
    TextInput,
    useRecordContext
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { ShowMatchingRecordsButton } from '@shared/components/fields/ShowMatchingRecordsButton';

const ShowReportablesButton = ({ resource }) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <ShowMatchingRecordsButton
            resource={resource}
            filter={{ salaryReportId: record.id }}
        />
    );
};

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
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
            <ShowReportablesButton resource="att_report" label="דיווחים" />
            <ShowReportablesButton resource="answer" label="תשובות" />
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <DateInput source="date" validate={[required()]} />
        <TextInput source="name" validate={[maxLength(255)]} />
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['ids', 'date', 'name', 'year'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    filterDefaultValues,
    importer,
};

export default getResourceComponents(entity);