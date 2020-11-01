import React, { useContext, useState, useEffect, useRef } from 'react';
import {
    BrowserRouter,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import SiteLayout from "./common/SiteLayout";
import { user as userApi } from "./common/api";
import { Input, Popconfirm, Form, Space, Table, Button, Card } from "antd";
import { isPropertyName, parseIsolatedEntityName } from 'typescript';

const PetOwnerStub = (props: RouteComponentProps) => {
    return <div>Oops, this page is still under construction</div>;
};

const CareTakerStub = (props: RouteComponentProps) => (
    <div>This is the content that you subscribed for</div>
);

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

const Dashboard = (props: RouteComponentProps) => {
    const { path, url } = useRouteMatch();
    console.log(path, url);
    return (
        <BrowserRouter>
            <SiteLayout {...props}>
                {/* <div> This is the landing page for Dashboard </div> */}
                <Switch>
                    <Route
                        path={`${path}/owner`}
                        component={PetOwnerStub}
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
    );
};

export default Dashboard;
