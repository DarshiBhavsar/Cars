import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
    const token = useSelector((state) => state.user.token) || localStorage.getItem('token');
    const role = useSelector((state) => state.user.role) || localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/home_page" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
