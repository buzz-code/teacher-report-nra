import { 
    DateInput, 
    NumberField, 
    TextField, 
    ReferenceField, 
    SelectField, 
    BooleanInput,
    DateField,
    BooleanField,
    useListContext
} from 'react-admin';
import { CommonDatagrid, getPivotColumns } from '@shared/components/crudContainers/CommonList';
import { MultiReferenceField } from '@shared/components/fields/CommonReferenceField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
    ({ isAdmin }) => isAdmin && <CommonReferenceInputFilter source="userId" reference="user" />,
    <CommonReferenceInputFilter 
        source="teacher.teacherTypeId" 
        reference="teacher_type" 
        label="סוג מורה"
        alwaysOn 
        dynamicFilter={filterByUserId} 
    />,
    <DateInput source="reportDate:$gte" label="תאריך דיווח אחרי" alwaysOn />,
    <DateInput source="reportDate:$lte" label="תאריך דיווח לפני" alwaysOn />,
    <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" label="מאושר" />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    const { data, filterValues } = useListContext();
    const selectedTeacherType = filterValues?.['teacher.teacherTypeId'];

    return (
        <CommonDatagrid {...props}>
            {children}
            
            {/* Universal fields - always shown */}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <MultiReferenceField source="teacherReferenceId" sortBy="teacher.name" reference="teacher" />
            <DateField source="reportDate" />
            <SelectField source="year" choices={yearChoices} />
            <BooleanField source="isConfirmed" />
            
            {/* Dynamic columns based on teacher type */}
            {getPivotColumns(data)}
            
            {/* Fallback for when no teacher type is selected */}
            {!selectedTeacherType && (
                <TextField source="comment" />
            )}
        </CommonDatagrid>
    );
}

const entity = {
    resource: 'att_report/pivot?extra.pivot=AttReportByTeacherType',
    Datagrid,
    filters,
    filterDefaultValues,
};

export default getResourceComponents(entity).list;