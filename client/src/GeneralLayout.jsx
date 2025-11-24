import { MenuItemLink } from 'react-admin';
import SummarizeIcon from '@mui/icons-material/Summarize';
import HelpIcon from '@mui/icons-material/Help';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import CallIcon from '@mui/icons-material/Call';
import SettingsIcon from '@mui/icons-material/Settings';
import DatasetIcon from '@mui/icons-material/Dataset';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MapIcon from '@mui/icons-material/Map';
import PercentIcon from '@mui/icons-material/Percent';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import BaseLayout from "@shared/components/layout/Layout";
import BaseDashboard from '@shared/components/views/Dashboard';
import { useDashboardItems } from './settings/settingsUtil';

const customMenuItems = [
    <MenuItemLink key="tutorial" to="/tutorial" primaryText="מדריך למשתמש" leftIcon={<HelpIcon />} />,
    <MenuItemLink key="pages-view" to="/pages-view" primaryText="הסברים נוספים" leftIcon={<ImportContactsIcon />} />,
    ({ isAdmin }) => isAdmin && <MenuItemLink key="yemot-simulator" to="/yemot-simulator" primaryText="סימולטור" leftIcon={<CallIcon />} />,
    <MenuItemLink key="roadmap" to="/roadmap" primaryText="פיתוחים עתידיים" leftIcon={<MapIcon />} />,
    <MenuItemLink key="settings" to="/settings" primaryText="הגדרות משתמש" leftIcon={<SettingsIcon />} />,
    // <MenuItemLink key="profile" to="/profile" primaryText="פרופיל" leftIcon={<PersonIcon />} />,
];

const menuGroups = [
    { name: 'data', icon: <DatasetIcon /> },
    { 
        name: 'reports', 
        icon: <SummarizeIcon />, 
        routes: [
            <MenuItemLink key="att-report-pricing" to="/att-report-pricing" primaryText="דוח נוכחות עם תמחור" leftIcon={<MonetizationOnIcon />} />,
            // <MenuItemLink key="att-report-by-teacher-type" to="/att-report-by-teacher-type" primaryText="דוחות לפי סוג מורה" leftIcon={<PercentIcon />} />,
        ]
    },
    { name: 'settings', icon: <SettingsIcon /> },
    { name: 'admin', icon: <AdminPanelSettingsIcon /> },
];

export const Layout = ({ children }) => (
    <BaseLayout customMenuItems={customMenuItems} menuGroups={menuGroups}>
        {children}
    </BaseLayout>
);

export const Dashboard = () => {
    const dashboardItems = useDashboardItems();
    return (
        <BaseDashboard dashboardItems={dashboardItems} />
    );
}
