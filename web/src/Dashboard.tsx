import React, { useState, useEffect } from "react";
import {
    BrowserRouter,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import SiteLayout from "./common/SiteLayout";
import AdminRoute from "./auth/AdminRoute";
import { user as userApi } from "./common/api";

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
    const { path, url } = useRouteMatch();
    // console.log(path, url);
    // path = '/dashboard' url = '/dashboard'
    return (
        <SiteLayout {...props}>
            {/* <div> This is the landing page for Dashboard </div> */}
            <Switch>
                <Route path={`${path}/owner`} component={PetOwnerStub}></Route>
                <Route
                    path={`${path}/sitter`}
                    component={CareTakerStub}
                ></Route>
                <AdminRoute path={`${path}/admin`} component={AdminStub} />
            </Switch>
        </SiteLayout>
    );
};

export default Dashboard;
