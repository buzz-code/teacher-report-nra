// Empty entity configuration for menu navigation to pivot table
// This provides menu access to the AttReportByTeacherType pivot

import { List, useRedirect } from 'react-admin';

// Component that immediately redirects to the pivot page
const AttReportByTeacherTypeList = () => {
    const redirect = useRedirect();
    
    // Redirect to the actual pivot table
    redirect('/att-report-by-teacher-type');
    
    return null;
};

const attReportByTeacherTypeEntity = {
    list: AttReportByTeacherTypeList,
};

export default attReportByTeacherTypeEntity;