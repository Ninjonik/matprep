import { usePocket } from '../contexts/PocketContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const RequireAuth = () => {
    const { user } = usePocket();
    const location = useLocation();

    if (!user) {
        return <Navigate to={{ pathname: '/slogin' }} state={{ location }} replace />;
    }

    return <Outlet />;
};
