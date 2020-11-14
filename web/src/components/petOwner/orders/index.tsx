import { message, Rate } from "antd";
import React, { PropsWithChildren, useEffect, useState } from "react";
import {
    Redirect,
    RouteComponentProps,
    Switch,
    useRouteMatch,
    Route
} from "react-router-dom";
import moment from "moment";
import { BidJoinCareTaker, BidStatus } from "../../../../../models/bid";
import OwnerRoute from "../../../auth/OwnerRoute";
import {
    bid,
    bid as bidApi,
    careTaker as careTakerApi
} from "../../../common/api";
import OrderCard from "./OrderCard";

const upcomingFilter = (bid: BidJoinCareTaker) =>
    bid.bid_status === "confirmed" &&
    moment(bid.start_date).isSameOrAfter(Date.now());
const completedFilter = (bid: BidJoinCareTaker) =>
    moment(bid.start_date).isBefore(Date.now()) && bid.bid_status;

const Order = () => {
    const { path } = useRouteMatch();
    const [bidDetails, setBidDetails] = useState<BidJoinCareTaker[] | null>(
        null
    );
    const getBids = async () => {
        try {
            const getBidDetails = await bid.getForOwner();
            setBidDetails(getBidDetails.data.data);
            console.log(getBidDetails);
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        try {
            getBids();
        } catch (error) {
            console.log(error);
        }
    }, []);

    console.log(bidDetails);
    // const updateCareTaker = () => {
    //     careTakerApi
    //         .getCareTaker()
    //         .then((res) => {
    //             const careTaker = res.data.data;
    //             setCareTaker(careTaker);
    //             refreshBids();
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             message.error(err.response.data.err);
    //         });
    // };
    // useEffect(updateCareTaker, []);
    // const refreshBids = () =>
    //     bidApi
    //         .getForCareTaker()
    //         .then((res) => {
    //             setBids(res.data.data);
    //         })
    //         .catch((err) => {
    //             console.log("There are no bids for this user");
    //             console.log(err.response.data.err);
    //         });
    return <div>{bidDetails?.map((o) => OrderCard(o))}</div>;
};

export default Order;

// <Switch>
/* <Route exact path={`${path}/`}>
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
            </CareTakerRoute> */
/* {</Switch>} */
