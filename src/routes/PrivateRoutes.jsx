import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserManagement from '../pages/UserManagement';
import AdminLayout from '../layouts/AdminLayout';

const PrivateRoutes = () => {
  return (
    <Routes>
      {/* Admin routes */}
      <Route 
        path="/admin/*" 
        element={
          <RequireAdmin>
            <AdminLayout>
              <Routes>
                <Route path="users" element={<UserManagement />} />
                {/* Add more admin routes here */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </RequireAdmin>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Admin route guard component
const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoutes; 