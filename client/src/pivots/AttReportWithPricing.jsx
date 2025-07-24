import { 
    DateInput, 
    NumberField, 
    TextField, 
    ReferenceField, 
    SelectField, 
    TextInput, 
    BooleanInput,
    DateField
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { MultiReferenceField } from '@shared/components/fields/CommonReferenceField';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
    ({ isAdmin }) => isAdmin && <CommonReferenceInputFilter source="userId" reference="user" />,
    <DateInput source="reportDate:$gte" label="תאריך דיווח אחרי" alwaysOn />,
    <DateInput source="reportDate:$lte" label="תאריך דיווח לפני" alwaysOn />,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <BooleanInput source="isConfirmed" label="מאושר" />,
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
            <MultiReferenceField source="teacherId" sortBy="teacher.name" reference="teacher" />
            <DateField source="reportDate" />
            <SelectField source="year" choices={yearChoices} />
            <NumberField source="howManyStudents" />
            <NumberField source="howManyLessons" />
            <NumberField source="howManyMethodic" />
            <ReferenceField source="activityType" reference="att_type" />
            <NumberField 
                source="price" 
                sortable={false}
                options={{ 
                    style: 'currency', 
                    currency: 'ILS', 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                }}
            />
            <TextField source="comment" />
            <ShowMatchingAttReportsButton />
        </CommonDatagrid>
    );
}

const entity = {
    resource: 'att_report/pivot?extra.pivot=AttReportWithPricing',
    Datagrid,
    filters,
    filterDefaultValues,
};

export default getResourceComponents(entity).list;