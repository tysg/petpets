import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    CareTaker,
    CareTakerDetails,
    SpecializesDetails,
    SpecializesIndexResponse,
    SpecializesIn,
    IndexResponse,
    GetResponse,
    StringResponse
} from "../models/careTaker";
import { asyncQuery, asyncTransaction } from "./../utils/db";
import { caretaker_query, specializes_query } from "./../sql/sql_query";
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
            error: ""
        };
        res.send(response);
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error
        };
        res.status(400).send(response);
    }
};

export const search = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date, pet_category } = req.query;
        const qr: QueryResult<SpecializesDetails> = await asyncQuery(
            caretaker_query.search_caretaker,
            [`${start_date}`, `${end_date}`, `${pet_category}`]
        );
        // TODO add check for no existing bookings
        // TODO add check for PT for rating > some value and caring < 5
        const { rows } = qr;
        const response: SpecializesIndexResponse = {
            data: rows,
            error: ""
        };
        res.send(response);
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error
        };
        res.status(400).send(response);
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const ctQueryResult: QueryResult<CareTakerDetails> = await asyncQuery(
            caretaker_query.get_caretaker,
            [email]
        );

        const specialzesQueryResult: QueryResult<SpecializesIn> = await asyncQuery(
            specializes_query.get_specializes,
            [email]
        );

        const response: GetResponse = {
            data: {
                ...ctQueryResult.rows[0],
                allSpecializes: specialzesQueryResult.rows
            },
            error: ""
        };
        res.send(response);
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error
        };
        res.status(400).send(response);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        await asyncTransaction(caretaker_query.delete_caretaker, [
            [email],
            [email]
        ]);
        const response: StringResponse = {
            data: `${email} is no longer a caretaker`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: error
        };
        res.status(400).send(response);
    }
};

const create = (ctStatus: number) => async (req: Request, res: Response) => {
    try {
        const caretaker: CareTaker = req.body;
        const createQuery =
            ctStatus == 1
                ? caretaker_query.create_part_time_ct
                : caretaker_query.create_part_time_ct;
        await asyncQuery(createQuery, [caretaker.email]);

        const specializesParams = caretaker.allSpecializes.map(
            (specializes: SpecializesIn) => [
                caretaker.email,
                specializes.typeName,
                specializes.ctPriceDaily
            ]
        );

        await specializesParams.map((params: any) =>
            asyncQuery(specializes_query.set_pt_specializes, params)
        );

        const response: StringResponse = {
            data: `${caretaker.email} created as caretaker`,
            error: ""
        };

        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: "User is already a part/full timer" + error
        };
        res.status(400).send(response);
    }
};

const update = (ctStatus: number) => async (req: Request, res: Response) => {
    try {
        const caretaker: CareTaker = req.body;
        const query =
            ctStatus == 1
                ? specializes_query.set_pt_specializes
                : specializes_query.set_ft_specializes;

        const specializesParams = caretaker.allSpecializes.map(
            (specializes: SpecializesIn) => [
                caretaker.email,
                specializes.typeName,
                specializes.ctPriceDaily
            ]
        );

        await asyncTransaction(specializes_query.delete_specializes, [
            [caretaker.email],
            [caretaker.email]
        ]);

        await specializesParams.map((params: any) => asyncQuery(query, params));

        const response: StringResponse = {
            data: `${caretaker.email} specializations updated`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: error
        };
        res.status(400).send(response);
    }
};

export const createPartTimer = create(1);
export const createFullTimer = create(2);

export const updatePartTimer = update(1);
export const updateFullTimer = update(2);
