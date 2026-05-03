import { CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { blue, green } from '@mui/material/colors';

import domainTranslations from 'src/domainTranslations';
import roadmapFeatures from 'src/roadmapFeatures';
import AdminAppShell from '@shared/components/app/AdminAppShell';
import CommonRoutes from '@shared/components/app/CommonRoutes';
import CommonAdminResources from '@shared/components/app/CommonAdminResources';
import CommonSettingsResources from '@shared/components/app/CommonSettingsResources';
import { buildResources } from '@shared/components/app/buildResources';

import { Dashboard, Layout } from 'src/GeneralLayout';

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

const resources = [
  { name: 'teacher_type',               config: teacherType,             icon: PersonIcon,             menuGroup: 'data' },
  { name: 'teacher',                    config: teacher,                 icon: BadgeIcon,              menuGroup: 'data' },
  { name: 'student_group',              config: studentGroup,            icon: PortraitIcon,           menuGroup: 'data' },
  { name: 'question_type',              config: questionType,            icon: CategoryIcon,           menuGroup: 'data' },
  { name: 'question',                   config: question,                icon: QuestionAnswerIcon,     menuGroup: 'data' },
  { name: 'teacher_question',           config: teacherQuestion,         icon: AssignmentTurnedInIcon, menuGroup: 'data' },
  { name: 'working_date',               config: workingDate,             icon: CalendarTodayIcon,      menuGroup: 'data' },
  { name: 'att_report',                 config: attReport,               icon: AssignmentIcon,         menuGroup: 'data' },
  { name: 'answer',                     config: answer,                  icon: RateReviewIcon,         menuGroup: 'data' },
  { name: 'reportable_item_with_price', config: reportableItemWithPrice, icon: MonetizationOnIcon,     menuGroup: 'reports' },
  { name: 'att_report_with_price',      config: attReportWithPrice,      icon: ReceiptIcon,            menuGroup: 'reports' },
  { name: 'answer_with_price',          config: answerWithPrice,         icon: ReceiptIcon,            menuGroup: 'reports' },
  { name: 'salary_report_by_teacher',   config: salaryReportByTeacher,   icon: ReceiptIcon,            menuGroup: 'reports' },
  { name: 'salary_report',              config: salaryReport,            icon: ReceiptIcon,            menuGroup: 'reports', condition: isAdmin },
  { name: 'price_by_user',              config: priceByUser,             icon: MonetizationOnIcon,     menuGroup: 'settings' },
  { name: 'price',                      config: price,                   icon: PaymentIcon,            menuGroup: 'admin',   condition: isAdmin },
  { name: 'att_type',                   config: attType,                 icon: CategoryIcon,           menuGroup: 'admin',   condition: isAdmin },
];

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
        {buildResources(resources, permissions)}
        {CommonSettingsResources()}
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
