import React, { PropsWithChildren, useEffect } from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
// import AuthenticatedRoute from "../auth/AuthenticatedRoute";
import PastJobs from "./caretaker/PastJobs";
import Rates from "./caretaker/Rates";

const CareTaker = (props: PropsWithChildren<RouteComponentProps>) => {
    const { path } = useRouteMatch();
    useEffect(() => {
        console.log("Get caretaker details");
    }, []);
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                {/* Call for registration */}
            </Route>
            <Route path={`${path}/upcoming`} component={PastJobs}></Route>
            <Route path={`${path}/pending`} component={PastJobs}></Route>
            <Route path={`${path}/pastjobs`} component={PastJobs}></Route>
            <Route path={`${path}/rates`} component={Rates}></Route>
        </Switch>
    );
};

export default CareTaker;
