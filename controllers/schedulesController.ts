import { Request, Response } from "express";
import { QueryResult } from "pg";
import { Schedule, IndexResponse, StringResponse } from "../models/schedule";
import { asyncQuery, asyncTransaction } from "./../utils/db";
import { schedule_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";

const index = (query: string) => async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        // TODO throw error if no result shown cos maybe caretaker_status is wrong
        const qr: QueryResult<Schedule> = await asyncQuery(query, [email]);
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

export const indexPartTimer = index(schedule_query.index_pt_schedule);
export const indexFullTimer = index(schedule_query.index_ft_schedule);

export const remove = async (req: Request, res: Response) => {
    try {
        const schedule: Schedule = req.body;

        await asyncTransaction(schedule_query.delete_schedule, [
            [schedule.email, schedule.start_date, schedule.end_date],
            [schedule.email, schedule.start_date, schedule.end_date]
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

const create = (query: string) => async (req: Request, res: Response) => {
    try {
        // TODO alterntively we can check database for this status
        // TODO sanitize date input? If typescript doesn't do a good job already
        // TODO check that schedules don't overlap, or should frontend enforce this?
        const schedule: Schedule = req.body;
        await asyncQuery(query, [
            schedule.email,
            schedule.start_date,
            schedule.end_date
        ]);
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

export const createPartTimer = create(schedule_query.create_pt_schedule);
export const createFullTimer = create(schedule_query.create_ft_schedule);
