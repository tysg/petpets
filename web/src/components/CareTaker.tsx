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
import { bid as bidApi, careTaker as careTakerApi } from "../common/api";
import Assignments from "./caretaker/Assignments";
import PastJobs from "./caretaker/PastJobs";
import Rates from "./caretaker/Rates";
import Register from "./caretaker/Register";

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
                const careTaker = res.data;
                setCareTaker(careTaker);
                // TODO: get all bids for this caretaker
                bidApi
                    .getForCareTaker(careTaker.email)
                    .then((res) => {
                        setBids(res.data);
                    })
                    .catch((err) => {
                        console.log("There are no bids for this user");
                    });
            })
            .catch((err) => {
                console.log(err);
                message.error("You are not yet a Care Taker");
            });
    }, []);
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                {careTaker ? (
                    <Redirect to={`${path}/upcoming`} />
                ) : (
                    // TODO:
                    <Register />
                )}
            </Route>
            <CareTakerRoute
                path={`${path}/upcoming`}
                careTakerDetails={careTaker}
            >
                <Assignments dataSource={bids} predicate={() => true} />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/pending`}
                careTakerDetails={careTaker}
            >
                <Assignments dataSource={bids} predicate={() => true} />
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
