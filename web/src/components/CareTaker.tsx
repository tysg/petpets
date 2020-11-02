import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import AuthenticatedRoute from "../auth/AuthenticatedRoute";
import PastJobs from "./caretaker/PastJobs";

const CareTaker = () => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <AuthenticatedRoute
                exact
                path={path}
                component={PastJobs}
            ></AuthenticatedRoute>
            <AuthenticatedRoute
                path={`${path}/pastjobs`}
                component={PastJobs}
            ></AuthenticatedRoute>
        </Switch>
    );
};

export default CareTaker;
