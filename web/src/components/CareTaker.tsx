import { message, Rate } from "antd";
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Redirect,
    RouteComponentProps,
    Switch,
    useRouteMatch,
    Route
} from "react-router-dom";
import { Bid, BidJoinOwnerPet } from "../../../models/bid";
import { CareTakerSpecializesDetails } from "../../../models/careTaker";
import CareTakerRoute from "../auth/CareTakerRoute";
import { bid as bidApi, careTaker as careTakerApi } from "../common/api";
import AssignmentCard from "./caretaker/AssignmentCard";
import Assignments from "./caretaker/Assignments";
import PastCard from "./caretaker/PastCard";
import PendingCard from "./caretaker/PendingCard";
import Rates from "./caretaker/Rates";
import Register from "./caretaker/Register";
import Schedule from "./caretaker/Schedule";

const CareTaker = (props: PropsWithChildren<RouteComponentProps>) => {
    const { path } = useRouteMatch();
    const [
        careTaker,
        setCareTaker
    ] = useState<CareTakerSpecializesDetails | null>(null);
    const [bids, setBids] = useState<BidJoinOwnerPet[]>([]);
    useEffect(() => {
        careTakerApi
            .getCareTaker()
            .then((res) => {
                const careTaker = res.data.data;
                setCareTaker(careTaker);
                refreshBids();
            })
            .catch((err) => {
                console.log(err);
                message.error(err.response.data.err);
            });
    }, []);
    const refreshBids = () =>
        bidApi
            .getForCareTaker()
            .then((res) => {
                setBids(res.data.data);
            })
            .catch((err) => {
                console.log("There are no bids for this user");
                console.log(err.response.data.err);
            });
    return (
        <Switch>
            <Route exact path={`${path}/`}>
                {careTaker ? (
                    // <Redirect to={`${path}/pending`} />
                    <Redirect to={`${path}/rates`} />
                ) : (
                    <Register {...props} />
                )}
            </Route>
            <CareTakerRoute
                path={`${path}/upcoming`}
                careTakerDetails={careTaker}
            >
                <Assignments
                    dataSource={bids.filter((bid) => true)}
                    emptyMsg="No upcoming jobs"
                    card={AssignmentCard}
                />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/pending`}
                careTakerDetails={careTaker}
            >
                <Assignments
                    dataSource={bids.filter((bid) => true)}
                    emptyMsg="No pending jobs"
                    card={PendingCard}
                />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/reviews`}
                careTakerDetails={careTaker}
            >
                <Assignments
                    dataSource={bids.filter((bid) => true)}
                    emptyMsg="No past assignments"
                    card={PastCard}
                />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/schedule`}
                careTakerDetails={careTaker}
            >
                <Schedule {...careTaker!} />
            </CareTakerRoute>
            <CareTakerRoute path={`${path}/rates`} careTakerDetails={careTaker}>
                <Rates {...careTaker!} />
            </CareTakerRoute>
        </Switch>
    );
};

export default CareTaker;
