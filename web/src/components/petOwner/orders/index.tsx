import React, { PropsWithChildren, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import moment from "moment";
import { BidJoinCareTaker, Bid } from "../../../../../models/bid";
import {
    bid,
    bid as bidApi,
    careTaker as careTakerApi
} from "../../../common/api";
import { Empty } from "antd";
import OrderCard from "./OrderCard";
import ReviewModal from "./Modal";

const pendingFilter = (bid: BidJoinCareTaker) => bid.bid_status === "submitted";
const upcomingFilter = (bid: BidJoinCareTaker) =>
    bid.bid_status === "confirmed" &&
    moment(bid.start_date).isSameOrAfter(Date.now());
const completedFilter = (bid: BidJoinCareTaker) =>
    bid.bid_status === "confirmed" &&
    moment(bid.start_date).isBefore(Date.now());
const closedFilter = (bid: BidJoinCareTaker) => bid.bid_status === "closed";

const reducer = (
    params: string,
    allBidDetails: BidJoinCareTaker[]
): [BidJoinCareTaker[], boolean] => {
    switch (params) {
        case "pending":
            return [allBidDetails.filter((b) => pendingFilter(b)), false];
        case "past":
            return [allBidDetails.filter((b) => completedFilter(b)), true];
        case "upcoming":
            return [allBidDetails.filter((b) => upcomingFilter(b)), false];
        case "closed":
            return [allBidDetails.filter((b) => closedFilter(b)), false];
        default:
            return [allBidDetails.filter((b) => closedFilter(b)), false];
    }
};
interface OrderParams {
    type: "past" | "upcoming";
}

const Order = () => {
    const match = useRouteMatch<OrderParams>();
    const routeParams: string = match.params.type;
    const [bidDetails, setBidDetails] = useState<BidJoinCareTaker[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [activeReview, setActiveReview] = useState<BidJoinCareTaker | null>(
        null
    );

    const getBids = async () => {
        try {
            const getBidDetails = await bid.getForOwner();
            setBidDetails(getBidDetails.data.data);
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

    useEffect(() => {
        if (activeReview !== null) setVisibleModal(true);
    }, [activeReview]);

    const [filteredBidDetails, canReview] = reducer(routeParams, bidDetails);

    const openModal = (order: BidJoinCareTaker) => {
        setActiveReview({ ...order });
    };

    const postReview = async (bid: Bid) => {
        await bidApi.updateBid(bid);
        await getBids();
        setVisibleModal(false);
    };

    return (
        <div>
            <ReviewModal
                order={activeReview}
                visible={visibleModal}
                onSubmit={postReview}
                onCancel={() => setVisibleModal(false)}
            />
            {filteredBidDetails?.length > 0 ? (
                filteredBidDetails.map((o, i) => (
                    <OrderCard
                        key={i}
                        index={i}
                        order={o}
                        canReview={canReview}
                        openModal={openModal}
                    />
                ))
            ) : (
                <Empty />
            )}
        </div>
    );
};

export default Order;
