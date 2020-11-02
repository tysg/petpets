<<<<<<< HEAD
import React, { useContext, useState, useEffect, useRef } from "react";
=======
import React, { useContext, useState, useEffect, useRef } from 'react';
>>>>>>> 19ab19086ffcb7dc69286db32465297a26edb47b
import {
    BrowserRouter,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import SiteLayout from "./common/SiteLayout";
<<<<<<< HEAD
<<<<<<< HEAD
import AdminRoute from "./auth/AdminRoute";
=======
import PastOrdersTable from "./PastOrdersTable";
>>>>>>> add front end for pet owner past orders
import { user as userApi } from "./common/api";
import AuthenticatedRoute from "./auth/AuthenticatedRoute";
import Admin from "./components/Admin";
import CareTaker from "./components/CareTaker";
=======
import PastOrdersTable from "./PastOrdersTable";
import { user as userApi } from "./common/api";
import { Input, Popconfirm, Form, Space, Table, Button, Card } from "antd";
import { isPropertyName, parseIsolatedEntityName } from 'typescript';
>>>>>>> 19ab19086ffcb7dc69286db32465297a26edb47b

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

<<<<<<< HEAD
const AdminStub = (props: RouteComponentProps) => (
    <div>This is the admin page. Are you sure you can access this?</div>
);
=======
const PastJobs = (props: RouteComponentProps) => {
  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date',},
    { title: 'Pet Name', dataIndex: 'petname', key: 'petname',},
    { title: 'Earning', dataIndex: 'earning', key: 'earning',},
    { title: 'Review', dataIndex: 'review', key: 'review',},
    { title: 'Rating', dataIndex: 'rating', key: 'rating',},
  ];
  const dataSource = [
    { key: '1',date: '11-11-2020', earning: '30', petname: 'Kobe',review: 'good',rating: '4',},
  ];
  return (
  <Space direction='vertical'>
    <Table dataSource={dataSource} columns={columns} />
  </Space>
  );
};
>>>>>>> 19ab19086ffcb7dc69286db32465297a26edb47b

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
