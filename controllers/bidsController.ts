import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    CtStatusAndSpecializes,
    Bid,
    OwnerResponse,
    CareTakerResponse,
    BidResponse,
    StringResponse,
    BidJoinOwnerPet,
    sqlify,
    BidStatus
} from "../models/bid";
import { CaretakerStatus } from "../models/careTaker";
import { asyncQuery } from "../utils/db";
import { bid_query } from "../sql/sql_query";
import { log } from "../utils/logging";
import moment from "moment";

// const mapBidJoinOwnerPetQuery = (r: QueryBidJoinOwnerPet) => ({
//     petOwner: r.pet_name,
//     petName: r.pet_name,
//     ctEmail: r.ct_email,
//     ctPrice: r.ct_price,
//     startDate: r.start_date,
//     endDate: r.end_date,
//     isCash: r.is_cash,
//     creditCard: r.credit_card,
//     transportMethod: r.transport_method,
//     bidStatus: r.bid_status,
//     feedback: r.feedback,
//     rating: r.rating,
//     fullname: r.fullname,
//     address: r.address,
//     phone: r.phone,
//     role: r.role,
//     avatarUrl: r.avatar_link,
//     category: r.category,
//     requirements: r.requirements,
//     description: r.description
// });

export const owner_get = async (req: Request, res: Response) => {
    try {
        const { owner_email } = req.params;
        const qr: QueryResult<Bid> = await asyncQuery(
            bid_query.owner_get_bids,
            [owner_email]
        );
        const { rows } = qr;
        const response: OwnerResponse = {
            data: rows,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { owner_email } = req.params;
        log.error("get owner bids error", error);
        const response: StringResponse = {
            data: "",
            error: `Bids of ${owner_email} not found: ` + error
        };
        res.status(400).send(response);
    }
};

export const ct_get = async (req: Request, res: Response) => {
    try {
        const { ct_email } = req.params;
        const qr: QueryResult<BidJoinOwnerPet> = await asyncQuery(
            bid_query.caretaker_get_bids,
            [ct_email]
        );

        const response: CareTakerResponse = {
            data: qr.rows,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { ct_email } = req.params;
        log.error("get caretaker bids error", error);
        const response: StringResponse = {
            data: "",
            error: `Bids of ${ct_email} not found: ` + error
        };
        res.status(400).send(response);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { ct_email, owner_email, pet_name, start_date, end_date } = req.params;
        await asyncQuery(bid_query.delete_bid, [
            ct_email,
            owner_email,
            pet_name,
            start_date,
            end_date
        ]);
        const response: StringResponse = {
            data: `Bid by ${owner_email} with ${ct_email} for ${pet_name} from ${start_date} to on ${end_date} has been deleted `,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { ct_email, owner_email, pet_name, start_date, end_date } = req.params;
        log.error("delete bid error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Bid by ${owner_email} with ${ct_email} for ${pet_name} from ${start_date} to on ${end_date} cannot be deleted: ` +
                error
        };
        res.status(400).send(response);
    }
};


export const test = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.body;
    res.send(moment(startDate));
};

export const create = async (req: Request, res: Response) => {
    try {
        var bid: Bid = req.body;

        // query for the price & role of the CareTaker
        const priceStatusRow: QueryResult<CtStatusAndSpecializes> = await asyncQuery(
            bid_query.query_price_role,
            [bid.ct_email, bid.pet_name, bid.pet_owner]
        );
        
        const ctPrice = priceStatusRow.rows[0].ct_price_daily;
        const ctStatus = priceStatusRow.rows[0].caretaker_status;
        bid.bid_status =
            ctStatus === CaretakerStatus.partTimeCt ? "submitted" : "confirmed";
        bid.ct_price = ctPrice;

        await asyncQuery(bid_query.create_bid, sqlify(bid));
        const response: BidResponse = {
            data: bid,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { ct_email, owner_email, pet_name, start_date, end_date } = req.body;
        log.error("create bid error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Bid by ${owner_email} with ${ct_email} for ${pet_name} from ${start_date} to on ${end_date} cannot be created: ` +
                error
        };
        res.status(400).send(response);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { ct_email, owner_email, pet_name, start_date, end_date } = req.params;
        var bid: Bid = req.body;
        await asyncQuery(bid_query.update_bid, [
            ct_email,
            owner_email,
            pet_name,
            start_date,
            end_date,
            bid.bid_status,
            bid.rating,
            bid.feedback,
        ]);
        const response: StringResponse = {
            data: `Bid by ${owner_email} with ${ct_email} for ${pet_name} from ${start_date} to on ${end_date} has been updated. The new status is ${bid.bid_status}.`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { ct_email, owner_email, pet_name, start_date, end_date } = req.body;
        log.error("update bid error", error);
        const response: StringResponse = {
            data: "",
            error:
            `Bid by ${owner_email} with ${ct_email} for ${pet_name} from ${start_date} to on ${end_date} cannot be updated: ` +
                error
        };
        res.status(400).send(response);
    }
};
