import React, { useContext, useState, useEffect, useRef } from "react";
import {
    BrowserRouter,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import SiteLayout from "./common/SiteLayout";
<<<<<<< HEAD
import AdminRoute from "./auth/AdminRoute";
=======
import PastOrdersTable from "./PastOrdersTable";
>>>>>>> add front end for pet owner past orders
import { user as userApi } from "./common/api";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import Admin from "./components/Admin";
import CareTaker from "./components/CareTaker";

const PetOwnerStub = (props: RouteComponentProps) => {
    return <div>Oops, this page is still under construction</div>;
};

const PastOrders = (props: RouteComponentProps) => {
  return (
  <Space direction='vertical'>
    <PastOrdersTable></PastOrdersTable>
  </Space>
  );
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
<<<<<<< HEAD
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
                    component={CareTaker}
                />
                <AdminRoute path={`${path}/admin`} component={Admin} />
            </Switch>
        </SiteLayout>
=======
        <BrowserRouter>
            <SiteLayout {...props}>
                {/* <div> This is the landing page for Dashboard </div> */}
                <Switch>
                    <Route
                        path={`${path}/owner`}
                        component={PetOwnerStub}
                    ></Route>
                    <Route
                        path={`${path}/pastorders`}
                        component={PastOrders}
                    ></Route>
                    <Route
                        path={`${path}/sitter`}
                        component={CareTakerStub}
                    ></Route>
                    <Route 
                        path={`${path}/pastjobs`} 
                        component={PastJobs}>
                    </Route>
                    {/* <Route path={`${path}/admin`} component={CareTakerStub}></Route> */}
                </Switch>
            </SiteLayout>
        </BrowserRouter>
>>>>>>> add front end for pet owner past orders
    );
};

export default Dashboard;
