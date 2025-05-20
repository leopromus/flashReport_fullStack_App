import { Button, Stack, Typography, Alert } from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { register } from '../../store/slices/authSlice';

const CreateAdminUser = () => {
  const dispatch = useAppDispatch();

  const handleCreateAdmin = async () => {
    try {
      // Create admin user data matching the backend User model
      const adminData = {
        firstname: 'Admin',
        lastname: 'User',
        email: 'admin@flashreport.com',
        phoneNumber: '+254722000000',
        username: 'admin',
        password: 'Admin@123',
        role: 'ADMIN'
      };

      await dispatch(register(adminData)).unwrap();
      alert('Admin user created successfully! You can now login with:\nUsername: admin\nPassword: Admin@123');
    } catch (error) {
      console.error('Failed to create admin user:', error);
      alert('Failed to create admin user. Check console for details.');
    }
  };

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h6">Create Test Admin User</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        This will create an admin user with:
        <br />
        Username: admin
        <br />
        Password: Admin@123
        <br />
        Email: admin@flashreport.com
      </Alert>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateAdmin}
      >
        Create Test Admin User
      </Button>
    </Stack>
  );
};

export default CreateAdminUser; 