import React from 'react';
import { Box } from '@chakra-ui/react';
import AdminNav from '../components/AdminNav';

const AdminLayout = ({ children }) => {
  return (
    <Box minH="100vh">
      <AdminNav />
      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout; 