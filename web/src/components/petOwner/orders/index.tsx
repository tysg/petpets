import React, { PropsWithChildren, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import moment from "moment";
import { BidJoinCareTaker, Bid } from "../../../../../models/bid";
import {
    bid,
    bid as bidApi,
    careTaker as careTakerApi
} from "../../../common/api";
import OrderCard from "./OrderCard";
import ReviewModal from "./Modal";

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
    const [bidDetails, setBidDetails] = useState<BidJoinCareTaker[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [activeReview, setActiveReview] = useState<BidJoinCareTaker | null>(
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

    const openModal = (index: number) => {
        if (bidDetails.length > 0) {
            const temp = bidDetails[index];
            setActiveReview(temp);
            setVisibleModal(true);
        }
    };

    const postReview = async (bid: Bid) => {
        await bidApi.updateBid(bid);
        await getBids();
        setVisibleModal(false);
    };

    return (
        <div>
            {bidDetails.length > 0 && (
                <ReviewModal
                    order={activeReview}
                    visible={visibleModal}
                    onSubmit={postReview}
                    onCancel={() => setVisibleModal(false)}
                />
            )}
            {filteredBidDetails?.map((o, i) => (
                <OrderCard
                    key={i}
                    order={o}
                    canReview={canReview}
                    openModal={openModal}
                />
            ))}
        </div>
    );
};

export default Order;
