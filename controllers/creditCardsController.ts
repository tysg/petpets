import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    CreditCardSchema,
    CreditCard,
    IndexResponse,
    CreditCardResponse,
    StringResponse,
    sqlify
} from "../models/creditCard";
import { asyncQuery } from "../utils/db";
import { credit_card_query } from "../sql/sql_query";
import { log } from "../utils/logging";
import { assert } from "console";
import * as yup from "yup";

const mapCreditCardRow = (r: any): CreditCard => ({
    cardholder: r.cardholder,
    cardNumber: r.card_number,
    securityCode: r.security_code,
    expiryDate: r.expiry_date
});

export const index = async (req: Request, res: Response) => {
    try {
        const { cardholder } = req.params;
        const qr = await asyncQuery(credit_card_query.index_cardholder, [
            cardholder
        ]);
        const rows = qr.rows.map(mapCreditCardRow);
        yup.array(CreditCardSchema)
            .defined()
            .validate(rows)
            .then((value) => {
                const response: IndexResponse = {
                    data: value,
                    error: ""
                };
                res.send(response);
            })
            .catch(console.log);
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
        const { card_number, cardholder } = req.params;

        const qr = await asyncQuery(credit_card_query.get_credit_card, [
            card_number,
            cardholder
        ]);
        const rows = qr.rows.map(mapCreditCardRow);
        yup.array(CreditCardSchema)
            .defined()
            .validate(rows)
            .then((value) => {
                const response: IndexResponse = {
                    data: value,
                    error: ""
                };
                res.send(response);
            })
            .catch(console.log);
    } catch (error) {
        const { card_number, cardholder } = req.params;
        log.error("get card error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Credit card ${card_number} of ${cardholder} not found: ` +
                error
        };
        res.status(400).send(response);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { card_number, cardholder } = req.params;
        await asyncQuery(credit_card_query.delete_credit_card, [
            card_number,
            cardholder
        ]);
        const response: StringResponse = {
            data: `${card_number} ${cardholder} has been deleted `,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { card_number, cardholder } = req.params;
        log.error("delete card error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Credit card ${card_number} of ${cardholder} cannot be deleted: ` +
                error
        };
        res.status(400).send(response);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const credit_card: CreditCard = req.body;
        await asyncQuery(
            credit_card_query.create_credit_card,
            sqlify(credit_card)
        );
        const response: CreditCardResponse = {
            data: credit_card,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { card_number, cardholder } = req.body;
        log.error("create card error", error);
        const response: StringResponse = {
            data: "",
            error:
                `Credit card ${card_number} of ${cardholder} cannot be created: ` +
                error
        };
        res.status(400).send(response);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const credit_card: CreditCard = req.body;
        await asyncQuery(
            credit_card_query.update_credit_card,
            sqlify(credit_card)
        );
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
            error:
                `Credit Card ${credit_card} of ${cardholder} cannot be updated:` +
                error
        };
        res.status(400).send(response);
    }
};
