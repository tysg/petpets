import React from "react";
import { Redirect, RouteProps, Route, useRouteMatch } from "react-router-dom";
import { Pet } from "../../../models/pet";

// handle the private routes
interface OwnerRouteProps extends RouteProps {
    pets: Pet[];
}
const OwnerRoute = ({ component, pets, ...rest }: OwnerRouteProps) => {
    const { path } = useRouteMatch();
    if (pets) {
        return <Route {...rest} component={component} />;
    }
    return <Redirect to={`${path}/`} />;
};

export default OwnerRoute;
