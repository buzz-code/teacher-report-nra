import { Admin, Resource, CustomRoutes } from 'react-admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { blue, green } from '@mui/material/colors';

import domainTranslations from 'src/domainTranslations';
import dataProvider from "@shared/providers/dataProvider";
import { getI18nProvider } from "@shared/providers/i18nProvider";
import authProvider from "@shared/providers/authProvider";
import { createTheme } from "@shared/providers/themeProvider";
import RTLStyle from "@shared/components/layout/RTLStyle";
import { CommonRepresentation } from '@shared/components/CommonRepresentation';
import roadmapFeatures from 'src/roadmapFeatures';

const appTheme = createTheme({
  primary: blue[700],    // Educational, professional blue
  secondary: green[600], // Supporting green instead of orange
  isRtl: true
});

import { Dashboard, Layout } from 'src/GeneralLayout';

import { resourceEntityGuesser } from '@shared/components/crudContainers/EntityGuesser';

// Shared entities (used by teacher reporting system)
import student from "src/entities/student";
import teacher from "src/entities/teacher";

// Teacher Report System Entities
import teacherType from "src/entities/teacher-type";
import attReport from "src/entities/att-report";
import attType from "src/entities/att-type";
import price from "src/entities/price";
import question from "src/entities/question";
import questionType from "src/entities/question-type";
import answer from "src/entities/answer";
import workingDate from "src/entities/working-date";
import salaryReport from "src/entities/salary-report";

// Common entities and utilities
import text from "@shared/components/common-entities/text";
import textByUser from "@shared/components/common-entities/text-by-user";
import user from "@shared/components/common-entities/user";
import auditLog from '@shared/components/common-entities/audit-log';
import importFile from '@shared/components/common-entities/import-file';
import mailAddress from '@shared/components/common-entities/mail-address';
import recievedMail from '@shared/components/common-entities/recieved-mail';
import page from '@shared/components/common-entities/page';
import image from '@shared/components/common-entities/image';
import paymentTrack from '@shared/components/common-entities/payment-track';
import yemotCall from '@shared/components/common-entities/yemot-call';

import Settings from 'src/settings/Settings';

// Import pivot components
import AttReportWithPricing from 'src/pivots/AttReportWithPricing';
import AttReportByTeacherType from 'src/pivots/AttReportByTeacherType';

import { isShowUsersData, isEditPagesData, isEditPaymentTracksData, isAdmin } from "@shared/utils/permissionsUtil";
import YemotSimulator from "@shared/components/views/YemotSimulator";
import { RegisterPage } from '@shared/components/layout/RegisterPage';
import { LoginPage } from '@shared/components/layout/LoginPage';
import Tutorial from '@shared/components/views/Tutorial';
import PageList from '@shared/components/views/PageList';
import Roadmap from '@shared/components/views/Roadmap';

// Icons
import BadgeIcon from '@mui/icons-material/Badge';
import PortraitIcon from '@mui/icons-material/Portrait';
import CategoryIcon from '@mui/icons-material/Category';
import ClassIcon from '@mui/icons-material/Class';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ImageIcon from '@mui/icons-material/Image';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsPhoneIcon from '@mui/icons-material/SettingsPhone';
import EmailIcon from '@mui/icons-material/Email';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';

const i18nProvider = getI18nProvider(domainTranslations);

const App = () => (
  <BrowserRouter>
    <RTLStyle>
      <Admin dataProvider={dataProvider} i18nProvider={i18nProvider} authProvider={authProvider}
        theme={appTheme} title='ניהול דוחות מורים'
        dashboard={Dashboard} layout={Layout} loginPage={LoginPage}
        requireAuth>
        {permissions => (
          <>
            {/* Shared entities (used by teacher reporting) */}
            <Resource name="student" {...student} options={{ menuGroup: 'data' }} icon={PortraitIcon} />
            <Resource name="teacher" {...teacher} options={{ menuGroup: 'data' }} icon={BadgeIcon} />
            
            {/* Teacher Report System Resources */}
            <Resource name="teacher_type" {...teacherType} options={{ menuGroup: 'reports' }} icon={PersonIcon} />
            <Resource name="att_report" {...attReport} options={{ menuGroup: 'reports' }} icon={AssignmentIcon} />
            <Resource name="att_type" {...attType} options={{ menuGroup: 'reports' }} icon={CategoryIcon} />
            <Resource name="price" {...price} options={{ menuGroup: 'reports' }} icon={PaymentIcon} />
            <Resource name="question" {...question} options={{ menuGroup: 'reports' }} icon={QuestionAnswerIcon} />
            <Resource name="question_type" {...questionType} options={{ menuGroup: 'reports' }} icon={CategoryIcon} />
            <Resource name="answer" {...answer} options={{ menuGroup: 'reports' }} icon={RateReviewIcon} />
            <Resource name="working_date" {...workingDate} options={{ menuGroup: 'reports' }} icon={CalendarTodayIcon} />
            <Resource name="salary_report" {...salaryReport} options={{ menuGroup: 'reports' }} icon={ReceiptIcon} />

            {/* Common settings and utilities */}
            <Resource name="text_by_user" {...textByUser} options={{ menuGroup: 'settings' }} icon={RateReviewIcon} />
            <Resource name="mail_address" {...mailAddress} options={{ menuGroup: 'settings' }} icon={AlternateEmailIcon} />
            <Resource name="image" {...image} options={{ menuGroup: 'settings' }} icon={ImageIcon} />
            <Resource name="import_file" {...importFile} options={{ menuGroup: 'settings' }} icon={UploadFileIcon} />
            
            {isAdmin(permissions) && <>
              <Resource name="text" {...text} options={{ menuGroup: 'admin' }} />
              <Resource name="yemot_call" {...yemotCall} options={{ menuGroup: 'admin' }} icon={SettingsPhoneIcon} />
              <Resource name="recieved_mail" {...recievedMail} options={{ menuGroup: 'admin' }} icon={EmailIcon} />
              <Resource name="audit_log" {...auditLog} options={{ menuGroup: 'admin' }} icon={LogoDevIcon} />
            </>}

            {isShowUsersData(permissions) && <>
              <Resource name="user" {...user} create={isAdmin(permissions) && user.create} options={{ menuGroup: 'admin' }} icon={AccountBoxIcon} />
            </>}

            {isEditPagesData(permissions) && <>
              <Resource name="page" {...page} options={{ menuGroup: 'admin' }} icon={AutoStoriesIcon} />
            </>}

            {(isEditPaymentTracksData(permissions) || isShowUsersData(permissions)) && <>
              <Resource name="payment_track" {...paymentTrack} list={isEditPaymentTracksData(permissions) ? paymentTrack.list : null} options={{ menuGroup: 'admin' }} icon={MonetizationOnIcon} />
            </>}

            <CustomRoutes>
              <Route path="/yemot-simulator" element={<YemotSimulator />} />
              <Route path="/tutorial" element={<Tutorial />} />
              <Route path="/pages-view" element={<PageList />} />
              <Route path="/roadmap" element={<Roadmap features={roadmapFeatures} />} />
              <Route path="/att-report-pricing" element={<AttReportWithPricing />} />
              <Route path="/att-report-by-teacher-type" element={<AttReportByTeacherType />} />
            </CustomRoutes>

            <CustomRoutes noLayout>
              <Route path="/register" element={<RegisterPage />} />
            </CustomRoutes>

            {!isAdmin(permissions) && <CustomRoutes>
              <Route path="/settings" element={<Settings />} />
            </CustomRoutes>}
          </>
        )}
      </Admin>
    </RTLStyle>
  </BrowserRouter>
);

export default App;
