import React, { PropsWithChildren } from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import NewRequest from "./petOwner/NewRequest";

const Owner = (props: PropsWithChildren<RouteComponentProps>) => {
    const { path } = useRouteMatch();
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                <Redirect to={`${path}/pets`} />
            </Route>
            <Route path={`${path}/pets`}>
                TODO: return my pets component here
            </Route>
            <Route path={`${path}/new-request`} component={NewRequest}></Route>
        </Switch>
    );
};

export default Owner;
