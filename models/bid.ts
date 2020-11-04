import { ApiResponse } from "./index";

export type BidStatus = "submitted" | "confirmed" | "reviewed" | "closed";
export type TransportMethod = "delivery" | "pickup" | "pcs";

export interface CtPrice {
    ct_price_daily: number;
}

export interface CtStatus {
    caretaker_status: number;
}

/**
 * POST api/bids, request;
 */
export interface Bid {
    ct_email: string;
    ct_price: number;
    start_date: Date;
    end_date: Date;
    is_cash: boolean;
    credit_card: number;
    transport_method: TransportMethod;
    pet_owner: string;
    pet_name: string;
    pet_category: string;
    bid_status: BidStatus;
    feedback: Text;
    rating: number;
}

export const sqlify = (bid: Bid) => [
    bid.ct_email,
    bid.ct_price,
    bid.start_date,
    bid.end_date,
    bid.is_cash,
    bid.credit_card,
    bid.transport_method,
    bid.pet_owner,
    bid.pet_name,
    bid.pet_category,
    bid.bid_status,
    bid.feedback,
    bid.rating
];

export interface BidPeriod {
    ct_email: string;
    ct_status: number;
    start_date: Date;
    end_date: Date;
}

export const sqlify_price_query = (arg1: string, arg2: string) => [arg1, arg2];

/**
 * GET api/bids/owner/:owner_email
 */
export type OwnerResponse = ApiResponse<Bid[], string>;

/**
 * GET api/bids/caretaker/:ct_email;
 */
export type CareTakerResponse = ApiResponse<Bid[], string>;

/**
 * POST api/bids;
 */
export type BidResponse = ApiResponse<Bid, string>;

export type StringResponse = ApiResponse<string, string>;
