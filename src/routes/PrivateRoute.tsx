import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../services/UserContext';


export const PrivateRoute = () => {
  const {isAuthenticated} = useUser();
  console.log("isAuthenticated", isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};
