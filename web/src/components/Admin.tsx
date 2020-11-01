import React from "react";
import { RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import AdminRoute from "../auth/AdminRoute";
import Settings from "./admin/Settings";
import Summary from "./admin/Summary";

const Admin = (props: RouteComponentProps) => {
    const { path } = useRouteMatch();
    console.log("admin path", path);
    return (
        <Switch>
            <AdminRoute exact path={`${path}/`}>
                Welcome, Admin
            </AdminRoute>
            <AdminRoute
                path={`${path}/settings`}
                component={Settings}
            ></AdminRoute>
            <AdminRoute
                path={`${path}/summary`}
                component={Summary}
            ></AdminRoute>
        </Switch>
    );
};

export default Admin;
