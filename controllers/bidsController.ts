import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    Bid,
    OwnerResponse,
    CareTakerResponse,
    BidResponse,
    StringResponse,
    sqlify,
    sqlify_price_query,
    sqlify_role_query
} from "../models/bid";
import { asyncQuery } from "../utils/db";
import { bid_query } from "../sql/sql_query";
import { log } from "../utils/logging";

export const owner_get = async (req: Request, res: Response) => {
    try {
        const { owner_email } = req.params;
        console.log([owner_email]);
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
            error:
                `Bids of ${owner_email} not found: ` + error
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
            error:
                `Bids of ${ct_email} not found: ` + error
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

export const create = async (req: Request, res: Response) => {
    try {
        var bid: Bid = req.body;
        const price: QueryResult<Number>= await asyncQuery(
            bid_query.query_price,
            sqlify_price_query(bid.ct_email, bid.pet_category)
        );
        const { rows } = price;
        bid.ct_price = <number>rows[0];
        console.log(rows[0]);
        await asyncQuery(
            bid_query.create_bid,
            sqlify(bid)
        );
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
        const bid: Bid = req.body;
        await asyncQuery(
            bid_query.update_bid,
            sqlify(bid)
        );
        const response: BidResponse = {
            data: bid,
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
