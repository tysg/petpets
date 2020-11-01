import React from "react";
import { RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import AdminRoute from "../auth/AdminRoute";

const SettingsStub = () => <div>Settings page</div>;

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
                component={SettingsStub}
            ></AdminRoute>
        </Switch>
    );
};

export default Admin;
