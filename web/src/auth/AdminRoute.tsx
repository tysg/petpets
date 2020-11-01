import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { getToken, getUser } from "./../common/token";

// handle the private routes
const AdminRoute = ({ component, ...rest }: RouteProps) => {
    if (getToken() && getUser()?.isAdmin()) {
        return <Route {...rest} component={component} />;
    }
    return <Redirect to="/denied" />;
};

export default AdminRoute;
