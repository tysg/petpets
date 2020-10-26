import { Request, Response } from "express";
import { QueryResult } from "pg";
import { CreditCard, IndexResponse, CreditCardResponse, StringResponse, sqlify } from "../models/creditCard";
import { asyncQuery } from "../utils/db";
import { credit_card_query } from "../sql/sql_query";
import { log } from "../utils/logging";
import { assert } from "console";

export const index = async (req: Request, res: Response) => {
    try {
        const { cardholder } = req.params;
        const qr: QueryResult<CreditCard> = await asyncQuery(credit_card_query.index_cardholder, [cardholder]);
        const { rows } = qr;
        const response: IndexResponse = {
            data: rows,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { cardholder } = req.params;
        log.error("get card error", error);
        const response: StringResponse = {
            data: "",
            error: `Credit cards of ${cardholder} not found: ` + error
        };
        res.status(400).send(response);
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const { cardNumber, cardholder } = req.params;
        const qr: QueryResult<CreditCard> = await asyncQuery(credit_card_query.get_credit_card, [cardNumber, cardholder]);
        const { rows } = qr;
        assert(rows.length == 1, "PK somehow unenforced!"); // By right if PK has been enforced
        const response: CreditCardResponse = {
            data: rows[0],
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { cardNumber, cardholder } = req.params;
        log.error("get card error", error);
        const response: StringResponse = {
            data: "",
            error: `Credit card ${cardNumber} of ${cardholder} not found: ` + error
        };
        res.status(400).send(response);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { cardNumber, cardholder } = req.params;
        await asyncQuery(credit_card_query.delete_credit_card, [cardNumber, cardholder]);
        const response: StringResponse = {
            data: `${cardNumber} ${cardholder} has been deleted `,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { cardNumber, cardholder } = req.params;
        log.error("delete card error", error);
        const response: StringResponse = {
            data: "",
            error: `Credit card ${cardNumber} of ${cardholder} cannot be deleted: ` + error
        };
        res.status(400).send(response);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const credit_card: CreditCard = req.body;
        await asyncQuery(credit_card_query.create_credit_card, sqlify(credit_card));
        const response: CreditCardResponse = {
            data: credit_card,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { cardNumber, cardholder } = req.body;
        log.error("create card error", error);
        const response: StringResponse = {
            data: "",
            error: `Credit card ${cardNumber} of ${cardholder} cannot be created: ` + error
        };
        res.status(400).send(response);
    }
}

export const update = async (req: Request, res: Response) => {
    try {
        const credit_card: CreditCard = req.body;
        await asyncQuery(credit_card_query.update_credit_card, sqlify(credit_card));
        const response: CreditCardResponse = {
            data: credit_card,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { credit_card, cardholder } = req.body;
        log.error("update card error", error);
        const response: StringResponse = {
            data: "",
            error: `Credit Card ${credit_card} of ${cardholder} cannot be updated:` + error
        };
        res.status(400).send(response);
    }
}



