import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDataProvider } from 'react-admin';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export const TeacherReportStats = () => {
  const dataProvider = useDataProvider();
  const { mutate, isPending, data } = useMutation({
    mutationFn: async () => {
      const [reportsResult, teachersResult] = await Promise.all([
        dataProvider.getList('att_report', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'reportDate', order: 'DESC' },
          filter: {}
        }),
        dataProvider.getList('teacher', {
          pagination: { page: 1, perPage: 1000 },
          sort: { field: 'name', order: 'ASC' },
          filter: {}
        })
      ]);

      const reports = reportsResult.data || [];
      const teachers = teachersResult.data || [];

      // Calculate current month statistics
      const currentDate = new Date();
      const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const currentMonthReports = reports.filter(report => 
        new Date(report.reportDate) >= currentMonthStart
      );

      const confirmedReports = reports.filter(report => report.isConfirmed);
      const unconfirmedReports = reports.filter(report => !report.isConfirmed);

      return {
        totalReports: reports.length,
        currentMonthReports: currentMonthReports.length,
        totalTeachers: teachers.length,
        confirmedReports: confirmedReports.length,
        unconfirmedReports: unconfirmedReports.length,
        recentReports: reports.slice(0, 5) // Most recent 5 reports
      };
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  if (isPending || !data) {
    return (
      <Grid item xs={12} mt={3}>
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} mt={3}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        סטטיסטיקות דוחות מורים
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        {/* Total Reports Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {data.totalReports}
              </Typography>
              <Typography variant="body2">
                סה"כ דוחות
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Month Reports */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {data.currentMonthReports}
              </Typography>
              <Typography variant="body2">
                דוחות החודש
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Teachers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <PersonIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {data.totalTeachers}
              </Typography>
              <Typography variant="body2">
                מורים רשומים
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Confirmed Reports */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(45deg, #9C27B0 30%, #E1BEE7 90%)' }}>
            <CardContent sx={{ textAlign: 'center', color: 'white' }}>
              <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div">
                {data.confirmedReports}
              </Typography>
              <Typography variant="body2">
                דוחות מאושרים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Unconfirmed Reports Alert */}
      {data.unconfirmedReports > 0 && (
        <Box mt={3}>
          <Card sx={{ background: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#856404', display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1 }} />
                דוחות הממתינים לאישור
              </Typography>
              <Typography variant="body1" sx={{ color: '#856404', mt: 1 }}>
                יש {data.unconfirmedReports} דוחות שטרם אושרו. יש לבדוק ולאשר אותם.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Grid>
  );
};