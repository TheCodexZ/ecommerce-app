import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const location = useLocation();
    
    if(isAuthenticated) {
        const from = location.state?.from || "/";
        return <Navigate to={from} replace />;
    }


    return <Outlet/>
}

export default PublicRoute;