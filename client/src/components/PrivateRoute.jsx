import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return element || <Outlet />;
};
export default PrivateRoute;
