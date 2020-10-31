import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    CareTaker,
    CareTakerDetails,
    IndexResponse,
    GetResponse,
    StringResponse,
} from "../models/careTaker";
import { asyncQuery } from "./../utils/db";
import { caretaker_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";

export const index = async (req: Request, res: Response) => {
    try {
        const qr: QueryResult<CareTakerDetails> = await asyncQuery(
            caretaker_query.index_caretaker,
            []
        );
        const { rows } = qr;
        const response: IndexResponse = {
            data: rows,
            error: "",
        };
        res.send(response);
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error,
        };
        res.status(400).send(response);
    }
};

export const search = async (req: Request, res: Response) => {
    try {
        const { date } = req.params;
        const qr: QueryResult<CareTakerDetails> = await asyncQuery(
            caretaker_query.search_caretaker,
            [date]
        );
        // TODO add check for specialization
        // TODO add check for no existing bookings
        // TODO add check for PT for rating > some value and caring < 5
        const { rows } = qr;
        const response: IndexResponse = {
            data: rows,
            error: "",
        };
        res.send(response);
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error,
        };
        res.status(400).send(response);
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const qr: QueryResult<CareTakerDetails> = await asyncQuery(
            caretaker_query.get_caretaker,
            [email]
        );
        const response: GetResponse = {
            data: qr.rows[0],
            error: "",
        };
        res.send(response);
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error,
        };
        res.status(400).send(response);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        await asyncQuery(caretaker_query.delete_caretaker, [email]);
        const response: StringResponse = {
            data: `${email} is no longer a caretaker`,
            error: "",
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: error,
        };
        res.status(400).send(response);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const caretaker: CareTaker = req.body;
        if (caretaker.caretaker_status == 1) {
            await asyncQuery(caretaker_query.create_part_time_ct, [
                caretaker.email,
            ]);
        } else if (caretaker.caretaker_status == 2) {
            await asyncQuery(caretaker_query.create_full_time_ct, [
                caretaker.email,
            ]);
        }
        const response: StringResponse = {
            data: `${caretaker.email} created as caretaker`,
            error: "",
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: error,
        };
        res.status(400).send(response);
    }
};
