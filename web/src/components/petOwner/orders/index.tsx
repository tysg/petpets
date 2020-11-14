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
    bid.bid_status === "confirmed" &&
    moment(bid.start_date).isBefore(Date.now());

interface OrderParams {
    type: "past" | "upcoming";
}

const Order = () => {
    const match = useRouteMatch<OrderParams>(); // console.log(match?.params.type === "past");
    const canReview = match.params.type === "past";
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
    const filteredBidDetails = canReview
        ? bidDetails?.filter((r) => completedFilter(r))
        : bidDetails?.filter((r) => upcomingFilter(r));

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
    return <div>{filteredBidDetails?.map((o) => OrderCard(o, canReview))}</div>;
};

export default Order;
