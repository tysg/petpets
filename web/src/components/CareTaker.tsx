import { message } from "antd";
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Redirect,
    RouteComponentProps,
    Switch,
    useRouteMatch,
    Route
} from "react-router-dom";
import { Bid } from "../../../models/bid";
import { CareTakerSpecializesDetails } from "../../../models/careTaker";
import CareTakerRoute from "../auth/CareTakerRoute";
import { careTaker as careTakerApi } from "../common/api";
import Assignments from "./caretaker/Assignments";
import PastJobs from "./caretaker/PastJobs";
import Rates from "./caretaker/Rates";

const CareTaker = (props: PropsWithChildren<RouteComponentProps>) => {
    const { path } = useRouteMatch();
    const [
        careTaker,
        setCareTaker
    ] = useState<CareTakerSpecializesDetails | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    useEffect(() => {
        careTakerApi
            .getCareTaker()
            .then((res) => {
                console.log(res.data);
                setCareTaker(res.data);
            })
            .catch((err) => {
                console.log(err);
                message.error("Unable to retrieve from database");
            });
    }, []);
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                {careTaker ? (
                    <Redirect to={`${path}/upcoming`} />
                ) : (
                    // TODO:
                    <div>Register as caretaker</div>
                )}
            </Route>
            <CareTakerRoute
                path={`${path}/upcoming`}
                component={Assignments}
                careTakerDetails={careTaker}
            ></CareTakerRoute>
            <CareTakerRoute
                path={`${path}/pending`}
                careTakerDetails={careTaker}
            >
                <Assignments dataSource={bids} />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/pastjobs`}
                component={PastJobs}
                careTakerDetails={careTaker}
            ></CareTakerRoute>
            <CareTakerRoute
                path={`${path}/schedule`}
                component={Rates}
                careTakerDetails={careTaker}
            ></CareTakerRoute>
        </Switch>
    );
};

export default CareTaker;
