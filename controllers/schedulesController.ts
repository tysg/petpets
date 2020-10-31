import { query, Request, Response } from "express";
import { QueryResult } from "pg";
import { Schedule, IndexResponse, StringResponse } from "../models/schedule";
import { asyncQuery } from "./../utils/db";
import { schedule_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";

export const index = async (req: Request, res: Response) => {
    try {
        const { email, caretaker_status } = req.params;
        const query_method =
            caretaker_status == "1"
                ? schedule_query.index_pt_schedule
                : schedule_query.index_ft_schedule;
        const qr: QueryResult<Schedule> = await asyncQuery(query_method, [
            email
        ]);
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

export const remove = async (req: Request, res: Response) => {
    try {
        const schedule: Schedule = req.body;
        const query_method =
            schedule.caretaker_status == 1
                ? schedule_query.delete_pt_schedule
                : schedule_query.delete_ft_schedule;
        await asyncQuery(query_method, [
            schedule.email,
            schedule.start_date,
            schedule.end_date
        ]);
        const response: StringResponse = {
            data: `schedule deleted!`,
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

export const create = async (req: Request, res: Response) => {
    try {
        // TODO alterntively we can check database for this status
        const schedule: Schedule = req.body;
        if (schedule.caretaker_status == 1) {
            await asyncQuery(schedule_query.create_pt_schedule, [
                schedule.email,
                schedule.start_date,
                schedule.end_date
            ]);
        } else if (schedule.caretaker_status == 2) {
            await asyncQuery(schedule_query.create_ft_schedule, [
                schedule.email,
                schedule.start_date,
                schedule.end_date
            ]);
        }
        const response: StringResponse = {
            data: `schedule created!`,
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
