import { useGetIdentity } from "react-admin";

export const useDashboardItems = () => {
  const { identity } = useGetIdentity();
  return getDashboardItems(identity);
}

export function getDashboardItems(identity) {
  return identity?.additionalData?.dashboardItems || getDefaultDashboardItems();
}

export function getDefaultDashboardItems() {
  return [
      {
          resource: 'att_report',
          icon: 'Assignment',
          title: 'דוחות נוכחות',
          yearFilterType: 'year',
          filter: {}
      },
      {
          resource: 'teacher',
          icon: 'Person',
          title: 'מורים',
          yearFilterType: 'none',
          filter: {}
      },
      {
          resource: 'salary_report',
          icon: 'Receipt',
          title: 'דוחות שכר',
          yearFilterType: 'year',
          filter: {}
      },
      {
          resource: 'working_date',
          icon: 'CalendarToday',
          title: 'תאריכי עבודה',
          yearFilterType: 'year',
          filter: {}
      }
  ];
}

export const useMaintainanceMessage = () => {
  const { identity } = useGetIdentity();
  return getMaintainanceMessage(identity);
}

export function getMaintainanceMessage(identity) {
  return identity?.additionalData?.maintainanceMessage || '';
}
