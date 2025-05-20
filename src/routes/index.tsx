import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CreateReport from '../pages/CreateReport';
import ReportDetails from '../pages/ReportDetails';
import Profile from '../pages/Profile';
import AdminDashboard from '../pages/AdminDashboard';
import UserManagement from '../pages/UserManagement';

// Auth Guards
import PrivateRoute from '../components/auth/PrivateRoute';
import AdminRoute from '../components/auth/AdminRoute';

const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-report" element={<CreateReport />} />
          <Route path="reports/:id" element={<ReportDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
        </Route>
      </Route>
    </RouterRoutes>
  );
};

export default Routes; 