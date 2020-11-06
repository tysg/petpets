import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Redirect,
    Route,
    RouteComponentProps,
    Switch,
    useRouteMatch
} from "react-router-dom";
import NewRequest from "./petOwner/NewRequest";
import Pets from "./pet";
import OwnerRoute from "../auth/OwnerRoute";
import { Pet } from "../../../models/pet";

const Orders = () => <div>Orders stub</div>;

const Owner = (props: PropsWithChildren<RouteComponentProps>) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const { path } = useRouteMatch();
    useEffect(() => {}, []);
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                {pets ? (
                    <Redirect to={`${path}/pets`} />
                ) : (
                    <div>Register as pet owner</div>
                )}
            </Route>
            <OwnerRoute
                pets={pets}
                path={`${path}/pets`}
                component={Pets}
            ></OwnerRoute>
            <OwnerRoute
                pets={pets}
                path={`${path}/new-request`}
                component={NewRequest}
            ></OwnerRoute>
            <OwnerRoute
                pets={pets}
                path={`${path}/orders`}
                component={Orders}
            ></OwnerRoute>
        </Switch>
    );
};

export default Owner;
