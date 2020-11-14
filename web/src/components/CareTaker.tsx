import { message, Rate, Statistic } from "antd";
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Redirect,
    RouteComponentProps,
    Switch,
    useRouteMatch,
    Route
} from "react-router-dom";
import moment from "moment";
import { Bid, BidJoinOwnerPet } from "../../../models/bid";
import {
    CareTakerPayment,
    CareTakerSpecializesDetails,
    MonthlyPayment
} from "../../../models/careTaker";
import CareTakerRoute from "../auth/CareTakerRoute";
import { bid as bidApi, careTaker as careTakerApi } from "../common/api";
import AssignmentCard from "./caretaker/AssignmentCard";
import Assignments from "./caretaker/Assignments";
import PastCard from "./caretaker/PastCard";
import PendingCard from "./caretaker/PendingCard";
import Rates from "./caretaker/Rates";
import Register from "./caretaker/Register";
import Schedule from "./caretaker/availability/SchedulePage";
import ErrorPage from "./ErrorPage";

const upcomingFilter = (bid: Bid) =>
    bid.bid_status === "confirmed" &&
    moment(bid.start_date).isSameOrAfter(Date.now());
const pendingFilter = (bid: Bid) =>
    bid.bid_status === "submitted" &&
    moment(bid.start_date).isSameOrAfter(Date.now());
const completedFilter = (bid: Bid) =>
    // bid.bid_status === "reviewed" &&
    moment(bid.start_date).isBefore(Date.now());

const CareTaker = (props: PropsWithChildren<RouteComponentProps>) => {
    const { path } = useRouteMatch();
    const [
        careTaker,
        setCareTaker
    ] = useState<CareTakerSpecializesDetails | null>(null);
    const [bids, setBids] = useState<BidJoinOwnerPet[]>([]);
    const [salaries, setSalaries] = useState<MonthlyPayment[]>([]);
    const updateCareTaker = () => {
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
    };
    const fetchSalaries = async () => {
        try {
            const fetchedSalaries = (await careTakerApi.getPayment()).data.data
                .monthly_payment;
            setSalaries(fetchedSalaries);
        } catch (err) {
            console.log("fetch salary err", err);
        }
    };

    useEffect(() => {
        updateCareTaker();
        fetchSalaries();
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
                    <Redirect to={`${path}/upcoming`} />
                ) : (
                    <Register {...props} />
                )}
            </Route>
            <CareTakerRoute
                path={`${path}/upcoming`}
                careTakerDetails={careTaker}
            >
                <Assignments
                    refreshBids={refreshBids}
                    dataSource={bids.filter(upcomingFilter)}
                    emptyMsg="No upcoming jobs"
                    card={AssignmentCard}
                />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/pending`}
                careTakerDetails={careTaker}
            >
                <Assignments
                    refreshBids={refreshBids}
                    dataSource={bids.filter(pendingFilter)}
                    emptyMsg="No pending jobs"
                    card={PendingCard}
                />
            </CareTakerRoute>
            <CareTakerRoute
                path={`${path}/reviews`}
                careTakerDetails={careTaker}
            >
                <Statistic
                    title="This Month's Salary"
                    value={
                        salaries.find(
                            (v) =>
                                v.monthYear.getMonth() === new Date().getMonth()
                        )?.fullPay ?? "N/A"
                    }
                />
                <Assignments
                    refreshBids={refreshBids}
                    dataSource={bids.filter(completedFilter)}
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
                <Rates {...careTaker!} updateCareTaker={updateCareTaker} />
            </CareTakerRoute>
            <Route component={ErrorPage}></Route>
        </Switch>
    );
};

export default CareTaker;
