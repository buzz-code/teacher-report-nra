import { Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { blue, green } from '@mui/material/colors';

import domainTranslations from 'src/domainTranslations';
import roadmapFeatures from 'src/roadmapFeatures';
import AdminAppShell from '@shared/components/app/AdminAppShell';
import CommonRoutes from '@shared/components/app/CommonRoutes';
import CommonAdminResources from '@shared/components/app/CommonAdminResources';
import CommonSettingsResources from '@shared/components/app/CommonSettingsResources';

import { Dashboard, Layout } from 'src/GeneralLayout';

import { resourceEntityGuesser } from '@shared/components/crudContainers/EntityGuesser';

// Shared entities (used by teacher reporting system)
import studentGroup from "src/entities/student-group";
import teacher from "src/entities/teacher";

// Teacher Report System Entities
import teacherType from "src/entities/teacher-type";
import teacherQuestion from "src/entities/teacher-question";
import attReport from "src/entities/att-report";
import attReportWithPrice from "src/entities/att-report-with-price";
import attType from "src/entities/att-type";
import price from "src/entities/price";
import priceByUser from "src/entities/price-by-user";
import question from "src/entities/question";
import questionType from "src/entities/question-type";
import answer from "src/entities/answer";
import workingDate from "src/entities/working-date";
import salaryReport from "src/entities/salary-report";
import reportableItemWithPrice from "src/entities/reportable-item-with-price";
import answerWithPrice from "src/entities/answer-with-price";
import salaryReportByTeacher from "src/entities/salary-report-by-teacher";
import TeacherValidationPivot from "src/pivots/TeacherValidationPivot";

import Settings from 'src/settings/Settings';
import { isAdmin } from "@shared/utils/permissionsUtil";

// Icons
import BadgeIcon from '@mui/icons-material/Badge';
import PortraitIcon from '@mui/icons-material/Portrait';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';

const themeOptions = { primary: blue[700], secondary: green[600] };

const App = () => (
  <AdminAppShell
    title='ניהול דוחות מורים'
    themeOptions={themeOptions}
    domainTranslations={domainTranslations}
    dashboard={Dashboard}
    layout={Layout}
  >
    {permissions => (
      <>
        trigger client tests
        {/* Core master data */}
        <Resource name="teacher_type" {...teacherType} options={{ menuGroup: 'data' }} icon={PersonIcon} />
        <Resource name="teacher" {...teacher} options={{ menuGroup: 'data' }} icon={BadgeIcon} />
        <Resource name="student_group" {...studentGroup} options={{ menuGroup: 'data' }} icon={PortraitIcon} />
        <Resource name="question_type" {...questionType} options={{ menuGroup: 'data' }} icon={CategoryIcon} />
        <Resource name="question" {...question} options={{ menuGroup: 'data' }} icon={QuestionAnswerIcon} />
        <Resource name="teacher_question" {...teacherQuestion} options={{ menuGroup: 'data' }} icon={AssignmentTurnedInIcon} />
        <Resource name="working_date" {...workingDate} options={{ menuGroup: 'data' }} icon={CalendarTodayIcon} />
        <Resource name="att_report" {...attReport} options={{ menuGroup: 'data' }} icon={AssignmentIcon} />
        <Resource name="answer" {...answer} options={{ menuGroup: 'data' }} icon={RateReviewIcon} />

        {/* Reports */}
        <Resource name="reportable_item_with_price" {...reportableItemWithPrice} options={{ menuGroup: 'reports' }} icon={MonetizationOnIcon} />
        <Resource name="att_report_with_price" {...attReportWithPrice} options={{ menuGroup: 'reports' }} icon={ReceiptIcon} />
        <Resource name="answer_with_price" {...answerWithPrice} options={{ menuGroup: 'reports' }} icon={ReceiptIcon} />
        <Resource name="salary_report_by_teacher" {...salaryReportByTeacher} options={{ menuGroup: 'reports' }} icon={ReceiptIcon} />
        <Resource name="salary_report" {...(isAdmin(permissions) ? salaryReport : {})} options={{ menuGroup: 'reports' }} icon={ReceiptIcon} />

        {/* User customization (settings) */}
        <Resource name="price_by_user" {...priceByUser} options={{ menuGroup: 'settings' }} icon={MonetizationOnIcon} />
        {CommonSettingsResources()}

        {/* Extra admin resources for this project */}
        {isAdmin(permissions) && <>
          <Resource name="price" {...price} options={{ menuGroup: 'admin' }} icon={PaymentIcon} />
          <Resource name="att_type" {...attType} options={{ menuGroup: 'admin' }} icon={CategoryIcon} />
        </>}
        {CommonAdminResources({ permissions })}

        <CustomRoutes>
          <Route path="/teacher-validation-pivot" element={<TeacherValidationPivot />} />
        </CustomRoutes>
        {CommonRoutes({ permissions, roadmapFeatures, settingsPage: <Settings /> })}
      </>
    )}
  </AdminAppShell>
);

export default App;
