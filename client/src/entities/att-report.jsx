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
    useDataProvider
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { CommonDatagrid } from '@shared/components/crudContainers/CommonList';
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import { getResourceComponents } from '@shared/components/crudContainers/CommonEntity';
import CommonReferenceInput from '@shared/components/fields/CommonReferenceInput';
import { CommonReferenceInputFilter, filterByUserId, filterByUserIdAndYear } from '@shared/components/fields/CommonReferenceInputFilter';
import { commonAdminFilters } from '@shared/components/fields/PermissionFilter';
import { defaultYearFilter, yearChoices } from '@shared/utils/yearFilter';
import CommonAutocompleteInput from '@shared/components/fields/CommonAutocompleteInput';
import { BulkFixReferenceButton } from '@shared/components/crudContainers/BulkFixReferenceButton';

// Teacher type IDs matching server-side enum
const TeacherTypeId = {
    SEMINAR_KITA: 1,
    TRAINING: 2, // not in use
    MANHA: 3,
    RESPONSIBLE: 4, // not in use
    PDS: 5,
    KINDERGARTEN: 6,
    SPECIAL_EDUCATION: 7,
};

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

const Datagrid = ({ isAdmin, children, ...props }) => {
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
        if (!teacherReferenceId) {
            setTeacherTypeKey(null);
            return;
        }

        const fetchTeacherType = async () => {
            try {
                const teacher = await dataProvider.getOne('teacher', { id: teacherReferenceId });
                if (!teacher?.data?.teacherTypeReferenceId) {
                    setTeacherTypeKey(null);
                    return;
                }

                const teacherType = await dataProvider.getOne('teacher_type', { id: teacher.data.teacherTypeReferenceId });
                setTeacherTypeKey(teacherType?.data?.key || null);
            } catch (error) {
                console.error('Error fetching teacher type:', error);
                setTeacherTypeKey(null);
            }
        };

        fetchTeacherType();
    }, [teacherReferenceId, dataProvider]);

    // Helper function to check if a field should be shown for the current teacher type
    const shouldShow = (teacherTypes) => {
        if (!teacherTypeKey) return true; // Show all fields if teacher type not yet loaded
        return teacherTypes.includes(teacherTypeKey);
    };

    return <>
        teacher type key: {JSON.stringify(teacherTypeKey)}
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
        {shouldShow([TeacherTypeId.SEMINAR_KITA, TeacherTypeId.KINDERGARTEN]) && (
            <NumberInput source="howManyStudents" />
        )}

        {/* SEMINAR_KITA, SPECIAL_EDUCATION */}
        {shouldShow([TeacherTypeId.SEMINAR_KITA, TeacherTypeId.SPECIAL_EDUCATION]) && (
            <NumberInput source="howManyLessons" />
        )}

        {/* SEMINAR_KITA, PDS */}
        {shouldShow([TeacherTypeId.SEMINAR_KITA, TeacherTypeId.PDS]) && (
            <>
                <NumberInput source="howManyWatchOrIndividual" />
                <NumberInput source="howManyTeachedOrInterfering" />
            </>
        )}

        {/* SEMINAR_KITA only */}
        {shouldShow([TeacherTypeId.SEMINAR_KITA]) && (
            <>
                <BooleanInput source="wasKamal" />
                <NumberInput source="howManyLessonsAbsence" />
            </>
        )}

        {/* SEMINAR_KITA, MANHA, PDS */}
        {shouldShow([TeacherTypeId.SEMINAR_KITA, TeacherTypeId.MANHA, TeacherTypeId.PDS]) && (
            <NumberInput source="howManyDiscussingLessons" />
        )}

        {/* MANHA only */}
        {shouldShow([TeacherTypeId.MANHA]) && (
            <>
                <NumberInput source="howManyMethodic" />
                <TextInput source="fourLastDigitsOfTeacherPhone" validate={[maxLength(4)]} />
                <BooleanInput source="isTaarifHulia" />
                <BooleanInput source="isTaarifHulia2" />
                <BooleanInput source="isTaarifHulia3" />
                <NumberInput source="howManyWatchedLessons" />
                <TextInput source="teachedStudentTz" multiline />
                <NumberInput source="howManyYalkutLessons" />
                <NumberInput source="howManyStudentsHelpTeached" />
                <NumberInput source="teacherToReportFor" />
            </>
        )}

        {/* MANHA, SPECIAL_EDUCATION */}
        {shouldShow([TeacherTypeId.MANHA, TeacherTypeId.SPECIAL_EDUCATION]) && (
            <NumberInput source="howManyStudentsTeached" />
        )}

        {/* KINDERGARTEN only */}
        {shouldShow([TeacherTypeId.KINDERGARTEN]) && (
            <>
                <BooleanInput source="wasCollectiveWatch" />
                <BooleanInput source="wasStudentsGood" />
            </>
        )}

        {/* SPECIAL_EDUCATION only */}
        {shouldShow([TeacherTypeId.SPECIAL_EDUCATION]) && (
            <>
                <NumberInput source="howManyStudentsWatched" />
                <BooleanInput source="wasPhoneDiscussing" />
                <NumberInput source="whoIsYourTrainingTeacher" />
                <TextInput source="whatIsYourSpeciality" />
            </>
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