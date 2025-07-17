import { 
    DateField, 
    DateInput, 
    NumberField, 
    ReferenceField, 
    TextField, 
    BooleanField,
    BooleanInput 
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
    <CommonReferenceInputFilter source="salaryReport" reference="salary_report" dynamicFilter={filterByUserId} />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    <CommonAutocompleteInput source="salaryMonth" choices={[
        { id: 1, name: 'ינואר' },
        { id: 2, name: 'פברואר' },
        { id: 3, name: 'מרץ' },
        { id: 4, name: 'אפריל' },
        { id: 5, name: 'מאי' },
        { id: 6, name: 'יוני' },
        { id: 7, name: 'יולי' },
        { id: 8, name: 'אוגוסט' },
        { id: 9, name: 'ספטמבר' },
        { id: 10, name: 'אוקטובר' },
        { id: 11, name: 'נובמבר' },
        { id: 12, name: 'דצמבר' }
    ]} />,
    <BooleanInput source="isConfirmed" />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

const Datagrid = ({ isAdmin, children, ...props }) => {
    return (
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            <ReferenceField source="teacherId" reference="teacher" />
            <NumberField source="year" />
            <NumberField source="salaryMonth" />
            <ReferenceField source="salaryReport" reference="salary_report" />
            <BooleanField source="isConfirmed" />
            
            {/* Aggregated summary fields for salary calculation */}
            <NumberField source="howManyMethodic" label="סך שיעורי מתודיקה" />
            <NumberField source="howManyWatchedLessons" label="סך שיעורי צפייה" />
            <NumberField source="howManyDiscussingLessons" label="סך שיעורי דיון" />
            <NumberField source="howManyYalkutLessons" label="סך שיעורי ילקוט" />
            <NumberField source="howManyStudents" label="סך תלמידות" />
            <NumberField source="howManyStudentsHelpTeached" label="סך תלמידות שלימדו" />
            <NumberField source="howManyLessonsAbsence" label="סך שיעורים עם היעדרויות" />
            
            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

// This view is read-only for monthly salary calculation summaries
const Inputs = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h3>דוח חודשי - צפייה בלבד</h3>
            <p>דוח זה מיועד לחישוב שכר חודשי ואינו ניתן לעריכה ישירה.</p>
            <p>הנתונים מתעדכנים אוטומטית על בסיס הדוחות היומיים.</p>
        </div>
    );
}

const Representation = CommonRepresentation;

const entity = {
    Datagrid,
    Inputs,
    Representation,
    filters,
    filterDefaultValues,
    // This is read-only, no editing/creating allowed
    list: true,
    show: true,
    edit: false,
    create: false,
    // Override the API endpoint to use att_report but with monthly aggregation
    basePath: 'att_report',
};

export default getResourceComponents(entity);