import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    CareTaker,
    CareTakerDetails,
    IndexResponse,
    GetResponse,
    StringResponse
} from "../models/careTaker";
import { asyncQuery, asyncTransaction } from "./../utils/db";
import { caretaker_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";

type CareTakerRow = Record<
    | "fullname"
    | "phone"
    | "address"
    | "email"
    | "avatar_link"
    | "caretaker_status"
    | "rating"
    | "ct_price_hourly",
    any
>;
const careTakerRowToCareTakerDetails = (rows: CareTakerRow[]) =>
    rows.map(
        (r): CareTakerDetails => {
            return {
                fullname: r.fullname,
                address: r.address,
                caretakerStatus: r.caretaker_status,
                email: r.email,
                phone: r.phone,
                rating: r.rating,
                avatarUrl: r.avatar_link,
                ctPriceHourly: r.ct_price_hourly
            };
        }
    );

export const index = async (req: Request, res: Response) => {
    try {
        const qr: QueryResult<CareTakerRow> = await asyncQuery(
            caretaker_query.index_caretaker,
            []
        );
        console.log("hi");
        const { rows } = qr;
        const response: IndexResponse = {
            data: careTakerRowToCareTakerDetails(rows),
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
        console.log("asdf");
        const { start_date, end_date, pet_category } = req.query;
        const qr: QueryResult<CareTakerRow> = await asyncQuery(
            caretaker_query.search_caretaker,
            [`${start_date}`, `${end_date}`, `${pet_category}`]
        );
        // TODO add check for no existing bookings
        // TODO add check for PT for rating > some value and caring < 5
        const { rows } = qr;
        const response: IndexResponse = {
            data: careTakerRowToCareTakerDetails(rows),
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
        const qr: QueryResult<CareTakerRow> = await asyncQuery(
            caretaker_query.get_caretaker,
            [email]
        );
        const response: GetResponse = {
            data: careTakerRowToCareTakerDetails(qr.rows)[0],
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

export const createPartTimer = async (req: Request, res: Response) => {
    try {
        const caretaker: CareTaker = req.body;
        await asyncQuery(caretaker_query.create_part_time_ct, [
            caretaker.email
        ]);
        const specializesParams = caretaker.specializesIn.map((petCategory) => [
            caretaker.email,
            petCategory
        ]);
        await asyncQuery(caretaker_query.delete_specializes, [caretaker.email]);
        await specializesParams.map((params) =>
            asyncQuery(caretaker_query.set_specializes, params)
        );
        const response: StringResponse = {
            data: `${caretaker.email} created as caretaker`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: "User is already a full timer" + error
        };
        res.status(400).send(response);
    }
};

export const createFullTimer = async (req: Request, res: Response) => {
    try {
        const caretaker: CareTaker = req.body;
        await asyncQuery(caretaker_query.create_full_time_ct, [
            caretaker.email
        ]);
        console.log(await asyncQuery("SELECT * FROM count_sched", []));
        const specializesParams = caretaker.specializesIn.map((petCategory) => [
            caretaker.email,
            petCategory
        ]);
        await specializesParams.map((params) =>
            asyncQuery(caretaker_query.set_specializes, params)
        );
        const response: StringResponse = {
            data: `${caretaker.email} created as caretaker`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: "User is already a part timer" + error
        };
        res.status(400).send(response);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const caretaker: CareTaker = req.body;
        const specializesParams = caretaker.specializesIn.map((petCategory) => [
            caretaker.email,
            petCategory
        ]);
        await asyncQuery(caretaker_query.delete_specializes, [caretaker.email]);
        await specializesParams.map((params) =>
            asyncQuery(caretaker_query.set_specializes, params)
        );
        const response: StringResponse = {
            data: `${caretaker.email} specializations updated`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const response: StringResponse = {
            data: "",
            error: "User is already a part timer" + error
        };
        res.status(400).send(response);
    }
};
