import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
    const roles = decoded?.UserInfo?.roles || [];
    return (
        roles.find(role => (allowedRoles || []).includes(role))
            ? <Outlet />
            : auth?.user 
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    )
};

RequireAuth.propTypes = {
    allowedRoles: PropTypes.array,
}

export default RequireAuth;
