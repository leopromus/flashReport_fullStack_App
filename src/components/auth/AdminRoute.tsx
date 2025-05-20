import { useAppSelector } from '../../hooks';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { user } = useAppSelector((state) => state.auth);

  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute; 