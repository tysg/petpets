import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    BidPeriod,
    CtPrice,
    CtStatus,
    Bid,
    OwnerResponse,
    CareTakerResponse,
    BidResponse,
    StringResponse,
    sqlify
} from "../models/bid";
import { CaretakerStatus } from "../models/careTaker";
import { asyncQuery } from "../utils/db";
import { bid_query } from "../sql/sql_query";
import { log } from "../utils/logging";
import moment from "moment";
import { exception } from "console";

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
        const qr: QueryResult<Bid> = await asyncQuery(
            bid_query.caretaker_get_bids,
            [ct_email]
        );
        const { rows } = qr;
        const response: CareTakerResponse = {
            data: rows,
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
        const { ct_email, owner_email, pet_name, start_date } = req.params;
        await asyncQuery(bid_query.delete_bid, [
            ct_email,
            owner_email,
            pet_name,
            start_date
        ]);
        const response: StringResponse = {
            data: `Bid by ${owner_email} with ${ct_email} for ${pet_name} on ${start_date} has been deleted `,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { ct_email, owner_email, pet_name, start_date } = req.params;
        log.error("delete bid error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Bid by ${owner_email} with ${ct_email} for ${pet_name} on ${start_date} cannot be deleted: ` +
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
        const priceRow: QueryResult<CtPrice> = await asyncQuery(
            bid_query.query_price,
            [bid.ct_email, bid.pet_category]
        );

        const roleRow: QueryResult<CtStatus> = await asyncQuery(
            bid_query.query_role,
            [bid.ct_email]
        );

        const ctPrice = priceRow.rows[0].ct_price_daily;
        const ctStatus = roleRow.rows[0].caretaker_status;
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
        const { ct_email, owner_email, pet_name, start_date } = req.body;
        log.error("create bid error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Bid by ${owner_email} with ${ct_email} for ${pet_name} on ${start_date} cannot be created: ` +
                error
        };
        res.status(400).send(response);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const { ct_email, owner_email, pet_name, start_date } = req.params;
        await asyncQuery(bid_query.update_bid, [
            ct_email,
            owner_email,
            pet_name,
            start_date,
            "success"
        ]);
        const response: StringResponse = {
            data: `Bid by ${owner_email} with ${ct_email} for ${pet_name} on ${start_date} has been updated `,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { ct_email, owner_email, pet_name, start_date } = req.body;
        log.error("update bid error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Bid by ${owner_email} with ${ct_email} for ${pet_name} on ${start_date} cannot be updated:` +
                error
        };
        res.status(400).send(response);
    }
};
