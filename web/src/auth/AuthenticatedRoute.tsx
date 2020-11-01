import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { getToken } from "./../common/token";

// handle the private routes
const AuthenticatedRoute = ({ component, ...rest }: RouteProps) => {
    if (getToken()) {
        return <Route {...rest} component={component} />;
    }
    return <Redirect to="/login" />;
};

export default AuthenticatedRoute;
