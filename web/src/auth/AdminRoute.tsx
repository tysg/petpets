import React from "react";
import { Redirect, RouteProps } from "react-router-dom";
import { getUser } from "./../common/token";
import AuthenticatedRoute from "./AuthenticatedRoute";

// handle the private routes
const AdminRoute = ({ component, ...rest }: RouteProps) => {
    if (getUser()?.isAdmin()) {
        return <AuthenticatedRoute {...rest} component={component} />;
    }
    return <Redirect to="/denied" />;
};

export default AdminRoute;
