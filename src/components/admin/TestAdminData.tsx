import { Button, Stack, Typography } from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { createReport } from '../../store/slices/reportSlice';
import { generateAdminReports } from '../../utils/dummyData';

const TestAdminData = () => {
  const dispatch = useAppDispatch();

  const handleAddAdminReports = async () => {
    try {
      const dummyReports = generateAdminReports(5);
      const promises = dummyReports.map(report => dispatch(createReport(report)).unwrap());
      await Promise.all(promises);
      console.log('Successfully added admin test reports');
    } catch (error) {
      console.error('Failed to add admin test reports:', error);
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h6">Admin Test Data</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAddAdminReports}
      >
        Add Admin Test Reports
      </Button>
    </Stack>
  );
};

export default TestAdminData; 