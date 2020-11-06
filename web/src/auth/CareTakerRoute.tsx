import React from "react";
import { Redirect, RouteProps, Route, useRouteMatch } from "react-router-dom";
import {
    CareTakerDetails,
    CareTakerSpecializesDetails
} from "../../../models/careTaker";

// handle the private routes
interface CareTakerRouteProps extends RouteProps {
    careTakerDetails: CareTakerSpecializesDetails | null;
}
const CareTakerRoute = ({
    component,
    careTakerDetails,
    ...rest
}: CareTakerRouteProps) => {
    const { path } = useRouteMatch();
    if (careTakerDetails) {
        return <Route {...rest} component={component} />;
    }
    return <Redirect to={`${path}/`} />;
};

export default CareTakerRoute;
