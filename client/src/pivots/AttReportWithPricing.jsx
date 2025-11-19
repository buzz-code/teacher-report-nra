import {
    DateInput,
    NumberField,
    TextField,
    ReferenceField,
    SelectField,
    TextInput,
    BooleanField,
    DateField
} from 'react-admin';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';
import PriceExplanationField from '../entities/att-report/PriceExplanationField';

const filters = [
    adminUserFilter,
    <DateInput source="reportDate:$gte" label="תאריך דיווח אחרי" alwaysOn />,
    <DateInput source="reportDate:$lte" label="תאריך דיווח לפני" alwaysOn />,
    <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
    <CommonReferenceInputFilter source="teacher.teacherTypeReferenceId" reference="teacher_type" dynamicFilter={filterByUserId} alwaysOn />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    // <BooleanInput source="isConfirmed" label="מאושר" />,
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
            <ReferenceField source="teacherReferenceId" reference="teacher" />
            <DateField source="reportDate" />
            <DateField showDate showTime source="updateDate" />
            <NumberField source="year" />
            {/* <BooleanField source="isConfirmed" /> */}
            <ReferenceField source="salaryReportId" reference="salary_report" />
            <NumberField source="salaryMonth" />
            <TextField source="comment" />

            {/* Common fields across multiple teacher types */}
            <NumberField source="howManyStudents" />
            <NumberField source="howManyLessons" />
            <NumberField source="howManyWatchOrIndividual" />
            <NumberField source="howManyTeachedOrInterfering" />
            <NumberField source="howManyDiscussingLessons" />

            {/* SEMINAR_KITA specific */}
            <BooleanField source="wasKamal" />
            <NumberField source="howManyLessonsAbsence" />

            {/* MANHA specific */}
            <NumberField source="howManyMethodic" />
            <TextField source="fourLastDigitsOfTeacherPhone" />
            <BooleanField source="isTaarifHulia" />
            <BooleanField source="isTaarifHulia2" />
            <BooleanField source="isTaarifHulia3" />
            <NumberField source="howManyWatchedLessons" />
            <NumberField source="teacherToReportFor" />
            <TextField source="teachedStudentTz" />
            <NumberField source="howManyYalkutLessons" />
            <NumberField source="howManyStudentsHelpTeached" />

            {/* KINDERGARTEN specific */}
            <BooleanField source="wasCollectiveWatch" />
            <BooleanField source="wasStudentsGood" />

            {/* SPECIAL_EDUCATION specific */}
            <NumberField source="howManyStudentsTeached" />
            <NumberField source="howManyStudentsWatched" />
            <BooleanField source="wasPhoneDiscussing" />
            <NumberField source="whoIsYourTrainingTeacher" />
            <TextField source="whatIsYourSpeciality" />

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
            <PriceExplanationField source="priceExplanation" />
            <TextField source="comment" />
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