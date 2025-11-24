import {
    DateField,
    DateInput,
    DateTimeInput,
    maxLength,
    NumberInput,
    NumberField,
    ReferenceField,
    required,
    TextField,
    TextInput,
    BooleanField,
    BooleanInput,
    useDataProvider,
    SelectField,
    useListContext
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { get } from 'lodash';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { BulkFixReferenceButton } from '@shared/components/crudContainers/BulkFixReferenceButton';
import { shouldShowField } from '../utils/attReportFields';

const filters = [
    ...commonAdminFilters,
    <CommonReferenceInputFilter source="teacherReferenceId" reference="teacher" dynamicFilter={filterByUserId} alwaysOn />,
    <DateInput source="reportDate:$gte" />,
    <DateInput source="reportDate:$lte" />,
    <CommonReferenceInputFilter
        source="teacher.teacherTypeReferenceId"
        reference="teacher_type"
        label="סוג מורה"
        alwaysOn
        dynamicFilter={filterByUserId}
    />,
    <CommonAutocompleteInput source="year" choices={yearChoices} alwaysOn />,
    // <BooleanInput source="isConfirmed" />,
    <CommonReferenceInputFilter source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />,
    <CommonReferenceInputFilter source="activityType" reference="att_type" dynamicFilter={filterByUserId} />,
];

const filterDefaultValues = {
    ...defaultYearFilter,
};

function getTeacherTypeKeyByTeacherTypeId(dataProvider, teacherTypeId) {
    if (!teacherTypeId) return Promise.resolve(null);
    return dataProvider.getOne('teacher_type', { id: teacherTypeId })
        .then(response => response?.data?.key || null)
        .catch((error) => {
            console.error('Error fetching teacher type:', error);
            return null;
        });
}
function getTeacherTypeKeyByTeacherId(dataProvider, teacherId) {
    if (!teacherId) return Promise.resolve(null);
    return dataProvider.getOne('teacher', { id: teacherId })
        .then(response => getTeacherTypeKeyByTeacherTypeId(dataProvider, response?.data?.teacherTypeReferenceId))
        .catch((error) => {
            console.error('Error fetching teacher:', error);
            return null;
        });
}

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
    }, [dataProvider, setSelectedTeacherTypeKey, selectedTeacherTypeId]);

    const additionalBulkButtons = [
        isAdmin && <BulkFixReferenceButton key="fixReferences" label="תיקון שיוך מורה" />
    ];

    return (
        <CommonDatagrid {...props} additionalBulkButtons={additionalBulkButtons}>
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

            {/* Common fields across multiple teacher types */}
            {shouldShowField('howManyStudents', selectedTeacherTypeKey) && <NumberField source="howManyStudents" />}
            {shouldShowField('howManyLessons', selectedTeacherTypeKey) && <NumberField source="howManyLessons" />}
            {shouldShowField('howManyWatchOrIndividual', selectedTeacherTypeKey) && <NumberField source="howManyWatchOrIndividual" />}
            {shouldShowField('howManyTeachedOrInterfering', selectedTeacherTypeKey) && <NumberField source="howManyTeachedOrInterfering" />}
            {shouldShowField('howManyDiscussingLessons', selectedTeacherTypeKey) && <NumberField source="howManyDiscussingLessons" />}
            {/* SEMINAR_KITA specific */}
            {shouldShowField('wasKamal', selectedTeacherTypeKey) && <BooleanField source="wasKamal" />}
            {shouldShowField('howManyLessonsAbsence', selectedTeacherTypeKey) && <NumberField source="howManyLessonsAbsence" />}

            {/* MANHA specific */}
            {shouldShowField('howManyMethodic', selectedTeacherTypeKey) && <NumberField source="howManyMethodic" />}
            {shouldShowField('fourLastDigitsOfTeacherPhone', selectedTeacherTypeKey) && <TextField source="fourLastDigitsOfTeacherPhone" />}
            {shouldShowField('isTaarifHulia', selectedTeacherTypeKey) && <BooleanField source="isTaarifHulia" />}
            {shouldShowField('isTaarifHulia2', selectedTeacherTypeKey) && <BooleanField source="isTaarifHulia2" />}
            {shouldShowField('isTaarifHulia3', selectedTeacherTypeKey) && <BooleanField source="isTaarifHulia3" />}
            {shouldShowField('howManyWatchedLessons', selectedTeacherTypeKey) && <NumberField source="howManyWatchedLessons" />}
            {shouldShowField('teacherToReportFor', selectedTeacherTypeKey) && <NumberField source="teacherToReportFor" />}
            {shouldShowField('teachedStudentTz', selectedTeacherTypeKey) && <TextField source="teachedStudentTz" />}
            {shouldShowField('howManyYalkutLessons', selectedTeacherTypeKey) && <NumberField source="howManyYalkutLessons" />}
            {shouldShowField('howManyStudentsHelpTeached', selectedTeacherTypeKey) && <NumberField source="howManyStudentsHelpTeached" />}

            {/* KINDERGARTEN specific */}
            {shouldShowField('wasCollectiveWatch', selectedTeacherTypeKey) && <BooleanField source="wasCollectiveWatch" />}
            {shouldShowField('wasStudentsGood', selectedTeacherTypeKey) && <BooleanField source="wasStudentsGood" />}

            {/* SPECIAL_EDUCATION specific */}
            {shouldShowField('howManyStudentsTeached', selectedTeacherTypeKey) && <NumberField source="howManyStudentsTeached" />}
            {shouldShowField('howManyStudentsWatched', selectedTeacherTypeKey) && <NumberField source="howManyStudentsWatched" />}
            {shouldShowField('wasPhoneDiscussing', selectedTeacherTypeKey) && <BooleanField source="wasPhoneDiscussing" />}
            {shouldShowField('whoIsYourTrainingTeacher', selectedTeacherTypeKey) && <NumberField source="whoIsYourTrainingTeacher" />}
            {shouldShowField('whatIsYourSpeciality', selectedTeacherTypeKey) && <TextField source="whatIsYourSpeciality" />}

            {isAdmin && <DateField showDate showTime source="createdAt" />}
            {isAdmin && <DateField showDate showTime source="updatedAt" />}
        </CommonDatagrid>
    );
}

const Inputs = ({ isCreate, isAdmin }) => {
    const teacherReferenceId = useWatch({ name: 'teacherReferenceId' });
    const dataProvider = useDataProvider();
    const [teacherTypeKey, setTeacherTypeKey] = useState(null);

    useEffect(() => {
        const fetchTeacherType = async () => {
            const teacherTypeKey = await getTeacherTypeKeyByTeacherId(dataProvider, teacherReferenceId);
            setTeacherTypeKey(teacherTypeKey);
        };
        fetchTeacherType();
    }, [teacherReferenceId, dataProvider]);

    return <>
        {!isCreate && isAdmin && <TextInput source="id" disabled />}
        {isAdmin && <CommonReferenceInput source="userId" reference="user" validate={required()} />}
        <CommonReferenceInput source="teacherReferenceId" reference="teacher" validate={[required()]} dynamicFilter={filterByUserId} />
        <DateInput source="reportDate" validate={[required()]} />
        {!isCreate && <DateTimeInput source="updateDate" disabled={!isAdmin} />}
        <CommonAutocompleteInput source="year" choices={yearChoices} defaultValue={defaultYearFilter.year} />
        {/* <BooleanInput source="isConfirmed" /> */}

        {/* Salary fields - Universal */}
        <CommonReferenceInput source="salaryReportId" reference="salary_report" dynamicFilter={filterByUserId} />
        <NumberInput source="salaryMonth" />
        <TextInput source="comment" multiline />

        {/* SEMINAR_KITA, KINDERGARTEN */}
        {shouldShowField('howManyStudents', teacherTypeKey) && (
            <NumberInput source="howManyStudents" />
        )}

        {/* SEMINAR_KITA, SPECIAL_EDUCATION */}
        {shouldShowField('howManyLessons', teacherTypeKey) && (
            <NumberInput source="howManyLessons" />
        )}

        {/* SEMINAR_KITA, PDS */}
        {shouldShowField('howManyWatchOrIndividual', teacherTypeKey) && (
            <NumberInput source="howManyWatchOrIndividual" />
        )}
        {shouldShowField('howManyTeachedOrInterfering', teacherTypeKey) && (
            <NumberInput source="howManyTeachedOrInterfering" />
        )}

        {/* SEMINAR_KITA only */}
        {shouldShowField('wasKamal', teacherTypeKey) && (
            <BooleanInput source="wasKamal" />
        )}
        {shouldShowField('howManyLessonsAbsence', teacherTypeKey) && (
            <NumberInput source="howManyLessonsAbsence" />
        )}

        {/* SEMINAR_KITA, MANHA, PDS */}
        {shouldShowField('howManyDiscussingLessons', teacherTypeKey) && (
            <NumberInput source="howManyDiscussingLessons" />
        )}

        {/* MANHA only */}
        {shouldShowField('howManyMethodic', teacherTypeKey) && (
            <NumberInput source="howManyMethodic" />
        )}
        {shouldShowField('fourLastDigitsOfTeacherPhone', teacherTypeKey) && (
            <TextInput source="fourLastDigitsOfTeacherPhone" validate={[maxLength(4)]} />
        )}
        {shouldShowField('isTaarifHulia', teacherTypeKey) && (
            <BooleanInput source="isTaarifHulia" />
        )}
        {shouldShowField('isTaarifHulia2', teacherTypeKey) && (
            <BooleanInput source="isTaarifHulia2" />
        )}
        {shouldShowField('isTaarifHulia3', teacherTypeKey) && (
            <BooleanInput source="isTaarifHulia3" />
        )}
        {shouldShowField('howManyWatchedLessons', teacherTypeKey) && (
            <NumberInput source="howManyWatchedLessons" />
        )}
        {shouldShowField('teachedStudentTz', teacherTypeKey) && (
            <TextInput source="teachedStudentTz" multiline />
        )}
        {shouldShowField('howManyYalkutLessons', teacherTypeKey) && (
            <NumberInput source="howManyYalkutLessons" />
        )}
        {shouldShowField('howManyStudentsHelpTeached', teacherTypeKey) && (
            <NumberInput source="howManyStudentsHelpTeached" />
        )}
        {shouldShowField('teacherToReportFor', teacherTypeKey) && (
            <NumberInput source="teacherToReportFor" />
        )}

        {/* MANHA, SPECIAL_EDUCATION */}
        {shouldShowField('howManyStudentsTeached', teacherTypeKey) && (
            <NumberInput source="howManyStudentsTeached" />
        )}

        {/* KINDERGARTEN only */}
        {shouldShowField('wasCollectiveWatch', teacherTypeKey) && (
            <BooleanInput source="wasCollectiveWatch" />
        )}
        {shouldShowField('wasStudentsGood', teacherTypeKey) && (
            <BooleanInput source="wasStudentsGood" />
        )}

        {/* SPECIAL_EDUCATION only */}
        {shouldShowField('howManyStudentsWatched', teacherTypeKey) && (
            <NumberInput source="howManyStudentsWatched" />
        )}
        {shouldShowField('wasPhoneDiscussing', teacherTypeKey) && (
            <BooleanInput source="wasPhoneDiscussing" />
        )}
        {shouldShowField('whoIsYourTrainingTeacher', teacherTypeKey) && (
            <NumberInput source="whoIsYourTrainingTeacher" />
        )}
        {shouldShowField('whatIsYourSpeciality', teacherTypeKey) && (
            <TextInput source="whatIsYourSpeciality" />
        )}

        {/* Legacy/unused fields - show for backwards compatibility or admin */}
        {isAdmin && (
            <>
                <BooleanInput source="wasDiscussing" />
                <BooleanInput source="wasStudentsEnterOnTime" />
                <BooleanInput source="wasStudentsExitOnTime" />
                <CommonReferenceInput source="activityType" reference="att_type" dynamicFilter={filterByUserId} />
            </>
        )}

        {!isCreate && isAdmin && <DateTimeInput source="createdAt" disabled />}
        {!isCreate && isAdmin && <DateTimeInput source="updatedAt" disabled />}
    </>
}

const Representation = CommonRepresentation;

const importer = {
    fields: [
        'teacherTz', 'reportDate', 'updateDate', 'year', /* 'isConfirmed', */
        'salaryReportId', 'salaryMonth', 'comment',
        'howManyStudents', 'howManyMethodic', 'fourLastDigitsOfTeacherPhone',
        'teachedStudentTz', 'howManyYalkutLessons', 'howManyDiscussingLessons',
        'howManyStudentsHelpTeached', 'howManyLessonsAbsence', 'howManyWatchedLessons',
        'wasDiscussing', 'wasKamal', 'wasStudentsGood', 'wasStudentsEnterOnTime', 'wasStudentsExitOnTime',
        'activityType', 'teacherToReportFor', 'wasCollectiveWatch',
        'isTaarifHulia', 'isTaarifHulia2', 'isTaarifHulia3'
    ],
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