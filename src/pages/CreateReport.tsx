import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography } from '@mui/material';
import ReportForm from '../components/reports/ReportForm';
import { useAppDispatch, useAppSelector } from '../hooks';
import { createReport } from '../store/slices/reportSlice';
import type { Report } from '../types';

const CreateReport = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.reports);

  const handleSubmit = async (values: Partial<Report>) => {
    const resultAction = await dispatch(createReport(values));
    if (createReport.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Report
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Use this form to report corruption incidents or request government intervention.
          Please provide accurate information and any supporting media.
        </Typography>
        <ReportForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </Paper>
    </Container>
  );
};

export default CreateReport; 