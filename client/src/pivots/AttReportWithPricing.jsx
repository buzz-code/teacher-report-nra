import { useState, useEffect } from 'react';
import {
    DateInput,
    NumberField,
    TextField,
    ReferenceField,
    SelectField,
    BooleanField,
    DateField,
    useDataProvider,
    useListContext,
    useRecordContext,
} from 'react-admin';
import { get } from 'lodash';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { adminUserFilter } from '@shared/components/fields/PermissionFilter';
import PriceExplanationField from '../entities/att-report/PriceExplanationField';
import { shouldShowField, getTeacherTypeKeyByTeacherTypeId } from '../utils/attReportFields';

// Component to display the price paid for a specific field from priceExplanation
// Uses source prop for React Admin column header resolution
const FieldPriceField = ({ source, fieldKey, label }) => {
    const record = useRecordContext();

    if (!record?.priceExplanation?.components) {
        return null;
    }

    // Use fieldKey if provided, otherwise extract from source (e.g., "price.howManyStudents" -> "howManyStudents")
    const key = fieldKey || source?.replace('price.', '');
    const component = record.priceExplanation.components.find(c => c.fieldKey === key);

    if (!component) {
        return null;
    }

    return (
        <span>
            {component.subtotal.toFixed(2)} ₪
        </span>
    );
};

// Set default props for React Admin field behavior
FieldPriceField.defaultProps = {
    sortable: false,
};

// Currency formatting options
const currencyOptions = {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
};

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
    const { filterValues } = useListContext();
    const selectedTeacherTypeId = get(filterValues, 'teacher.teacherTypeReferenceId');
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
        <CommonDatagrid {...props}>
            {children}
            {isAdmin && <TextField source="id" />}
            {isAdmin && <ReferenceField source="userId" reference="user" />}
            <ReferenceField source="teacherReferenceId" reference="teacher" />
            <DateField source="reportDate" />
            <DateField showDate showTime source="updateDate" />
            <SelectField source="year" choices={yearChoices} />
            {/* <BooleanField source="isConfirmed" /> */}
            <ReferenceField source="salaryReportId" reference="salary_report" />
            <NumberField source="salaryMonth" />
            <TextField source="comment" />

            {/* Field-specific prices based on teacher type */}
            {/* SEMINAR_KITA, KINDERGARTEN */}
            {shouldShowField('howManyStudents', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudents" />}

            {/* SEMINAR_KITA, SPECIAL_EDUCATION */}
            {shouldShowField('howManyLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyLessons" />}

            {/* SEMINAR_KITA, PDS */}
            {shouldShowField('howManyWatchOrIndividual', selectedTeacherTypeKey) && <FieldPriceField source="howManyWatchOrIndividual" />}
            {shouldShowField('howManyTeachedOrInterfering', selectedTeacherTypeKey) && <FieldPriceField source="howManyTeachedOrInterfering" />}

            {/* SEMINAR_KITA, MANHA, PDS */}
            {shouldShowField('howManyDiscussingLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyDiscussingLessons" />}

            {/* SEMINAR_KITA only */}
            {shouldShowField('wasKamal', selectedTeacherTypeKey) && <FieldPriceField source="wasKamal" />}
            {shouldShowField('howManyLessonsAbsence', selectedTeacherTypeKey) && <FieldPriceField source="howManyLessonsAbsence" />}

            {/* MANHA only */}
            {shouldShowField('howManyMethodic', selectedTeacherTypeKey) && <FieldPriceField source="howManyMethodic" />}
            {shouldShowField('fourLastDigitsOfTeacherPhone', selectedTeacherTypeKey) && <FieldPriceField source="fourLastDigitsOfTeacherPhone" />}
            {shouldShowField('isTaarifHulia', selectedTeacherTypeKey) && <FieldPriceField source="isTaarifHulia" />}
            {shouldShowField('isTaarifHulia2', selectedTeacherTypeKey) && <FieldPriceField source="isTaarifHulia2" />}
            {shouldShowField('isTaarifHulia3', selectedTeacherTypeKey) && <FieldPriceField source="isTaarifHulia3" />}
            {shouldShowField('howManyWatchedLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyWatchedLessons" />}
            {shouldShowField('teacherToReportFor', selectedTeacherTypeKey) && <FieldPriceField source="teacherToReportFor" />}
            {shouldShowField('teachedStudentTz', selectedTeacherTypeKey) && <FieldPriceField source="teachedStudentTz" />}
            {shouldShowField('howManyYalkutLessons', selectedTeacherTypeKey) && <FieldPriceField source="howManyYalkutLessons" />}
            {shouldShowField('howManyStudentsHelpTeached', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudentsHelpTeached" />}

            {/* MANHA, SPECIAL_EDUCATION */}
            {shouldShowField('howManyStudentsTeached', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudentsTeached" />}

            {/* KINDERGARTEN only */}
            {shouldShowField('wasCollectiveWatch', selectedTeacherTypeKey) && <FieldPriceField source="wasCollectiveWatch" />}
            {shouldShowField('wasStudentsGood', selectedTeacherTypeKey) && <FieldPriceField source="wasStudentsGood" />}

            {/* SPECIAL_EDUCATION only */}
            {shouldShowField('howManyStudentsWatched', selectedTeacherTypeKey) && <FieldPriceField source="howManyStudentsWatched" />}
            {shouldShowField('wasPhoneDiscussing', selectedTeacherTypeKey) && <FieldPriceField source="wasPhoneDiscussing" />}
            {shouldShowField('whoIsYourTrainingTeacher', selectedTeacherTypeKey) && <FieldPriceField source="whoIsYourTrainingTeacher" />}
            {shouldShowField('whatIsYourSpeciality', selectedTeacherTypeKey) && <FieldPriceField source="whatIsYourSpeciality" />}

            <NumberField
                source="price"
                sortable={false}
                options={currencyOptions}
            />
            <PriceExplanationField source="priceExplanation" />
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