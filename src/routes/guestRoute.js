import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

function GuestRoutes() {
    const user = useSelector((state) => state.user.token);
    return user ? <Navigate to='/' replace /> : <Outlet />;
}

export default GuestRoutes;
