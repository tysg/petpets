import React, { useState, useEffect } from "react";
import { RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import SiteLayout from "./common/SiteLayout";
import AdminRoute from "./auth/AdminRoute";
import { user as userApi } from "./common/api";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import Admin from "./components/Admin";

const PetOwnerStub = (props: RouteComponentProps) => {
    return <div>Oops, this page is still under construction</div>;
};

const CareTakerStub = (props: RouteComponentProps) => (
    <div>This is the content that you subscribed for</div>
);

const AdminStub = (props: RouteComponentProps) => (
    <div>This is the admin page. Are you sure you can access this?</div>
);

const Dashboard = (props: RouteComponentProps) => {
    useEffect(() => {
        userApi.get("/ping");
    });
    const { path } = useRouteMatch();
    // console.log(path, url);
    // path = '/dashboard' url = '/dashboard'
    return (
        <SiteLayout {...props} path={path}>
            {/* <div> This is the landing page for Dashboard </div> */}
            <Switch>
                <AuthenticatedRoute
                    exact
                    path={path}
                    component={PetOwnerStub}
                />
                <AuthenticatedRoute
                    // path={[`${path}/`, `${path}/owner`]}
                    path={`${path}/owner`}
                    component={PetOwnerStub}
                />
                <AuthenticatedRoute
                    path={`${path}/sitter`}
                    component={CareTakerStub}
                />
                <AdminRoute path={`${path}/admin`} component={Admin} />
            </Switch>
        </SiteLayout>
    );
};

export default Dashboard;
