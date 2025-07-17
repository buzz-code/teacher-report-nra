import { 
    DateField, 
    DateInput, 
    DateTimeInput, 
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

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="questionId" reference="question" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="reportId" reference="att_report" dynamicFilter={filterByUserId} />,
    <NumberInput source="answer" />,
    <DateInput source="answerDate:$gte" label="תאריך תשובה מ-" />,
    <DateInput source="answerDate:$lte" label="תאריך תשובה עד-" />,
];

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <ReferenceField source="teacherId" reference="teacher" />
            <ReferenceField source="questionId" reference="question" />
            <ReferenceField source="reportId" reference="att_report" />
            <NumberField source="answer" />
            <DateField source="answerDate" />
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} />
        <CommonReferenceInput source="questionId" reference="question" validate={[required()]} dynamicFilter={filterByUserId} />
        <CommonReferenceInput source="reportId" reference="att_report" dynamicFilter={filterByUserId} />
        <NumberInput source="answer" validate={[required()]} />
        <DateInput source="answerDate" />
        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: ['teacherId', 'questionId', 'reportId', 'answer', 'answerDate'],
}

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    importer,
};

export default getResourceComponents(entity);