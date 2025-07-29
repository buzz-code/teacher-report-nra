import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDataProvider, useCreatePath, useGetPathForRecordCallback } from 'react-admin';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

export const RecentTeacherReports = () => {
  const dataProvider = useDataProvider();
  const { mutate, isPending, data } = useMutation({
    mutationFn: () => dataProvider.getList('att_report', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'reportDate', order: 'DESC' },
      filter: {}
    }),
  });
  const createPath = useCreatePath();
  const getPathForRecord = useGetPathForRecordCallback();
  const resource = 'att_report';

  useEffect(() => {
    mutate();
  }, []);

  return (
    <Grid item xs={12} mt={3}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        דוחות אחרונים
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {isPending || !data ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : data.data?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="recent reports table">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'white' }}>מורה</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>תאריך דיווח</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>סוג מורה</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>מספר תלמידים</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>סטטוס</TableCell>
                <TableCell align="right" sx={{ color: 'white' }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((report) => (
                <TableRow key={report.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Typography fontWeight="bold">
                      {report.teacher?.name || `מורה ${report.teacherReferenceId}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {new Date(report.reportDate).toLocaleDateString('he-IL')}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={report.teacher?.teacherType?.name || 'לא צוין'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {report.howManyStudents || 'לא דווח'}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      icon={report.isConfirmed ? <CheckCircleIcon /> : <PendingIcon />}
                      label={report.isConfirmed ? 'מאושר' : 'ממתין לאישור'}
                      size="small"
                      color={report.isConfirmed ? 'success' : 'warning'}
                      variant={report.isConfirmed ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Link to={getPathForRecord({ resource, record: report })}>
                      <Chip
                        label="צפה בפרטים"
                        size="small"
                        color="secondary"
                        clickable
                      />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box p={4} textAlign="center">
          <Typography variant="h6" color="textSecondary">
            אין דוחות זמינים
          </Typography>
          <Box mt={2}>
            <Link to={createPath({ resource })}>
              <Chip
                label="יצירת דוח חדש"
                color="primary"
                icon={<AssignmentIcon />}
                clickable
              />
            </Link>
          </Box>
        </Box>
      )}
    </Grid>
  );
};