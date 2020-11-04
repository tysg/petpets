import React, { PropsWithChildren } from "react";
import {
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
// import AuthenticatedRoute from "../auth/AuthenticatedRoute";
import PastJobs from "./caretaker/PastJobs";
import SitterProfile from "./caretaker/Profile";

// const CareTakerStub = () => {
//     const { path } = useRouteMatch();
//     return (
//         <Switch>
//             <AuthenticatedRoute
//                 exact
//                 path={path}
//                 component={PastJobs}
//             ></AuthenticatedRoute>
//             <AuthenticatedRoute
//                 path={`${path}/pastjobs`}
//                 component={PastJobs}
//             ></AuthenticatedRoute>
//         </Switch>
//     );
// };

const CareTaker = (props: PropsWithChildren<RouteComponentProps>) => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/`}></Route>
            <Route path={`${path}/pastjobs`} component={PastJobs}></Route>
            <Route path={`${path}/profile`} component={SitterProfile}></Route>
        </Switch>
    );
};

export default CareTaker;
