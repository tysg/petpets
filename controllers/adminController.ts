import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    MonthlyPayment,
    CareTaker,
    CareTakerDetails,
    SpecializesIn,
    CaretakerStatus
} from "../models/careTaker";
import { StringResponse } from "../models";
import {
    MonthlyRevenue,
    MonthlyBestCareTaker,
    MonthlyBestCareTakerDetails,
    MonthlyBestCareTakerIndexResponse,
    MonthlyRevenueIndexResponse
} from "../models/admin";
import { asyncQuery, asyncTransaction } from "./../utils/db";
import {
    caretaker_query,
    payments_query,
    specializes_query,
    admin_query
} from "./../sql/sql_query";
import { log } from "./../utils/logging";
import * as yup from "yup";

export const indexRevenue = async (req: Request, res: Response) => {
    try {
        const monthlyRevenueRows: QueryResult<MonthlyRevenue> = await asyncQuery(
            admin_query.get_monthly_revenue,
            []
        );

        const response: MonthlyRevenueIndexResponse = {
            data: monthlyRevenueRows.rows,
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

export const indexRevenueByBestCareTaker = async (
    req: Request,
    res: Response
) => {
    try {
        const bestCareTakerRows: QueryResult<MonthlyBestCareTaker> = await asyncQuery(
            admin_query.get_best_caretaker_by_month,
            ["5"]
        );

        const bestCareTakerDetails: MonthlyBestCareTakerDetails[] = await bestCareTakerRows.rows.map(
            async (
                ct: MonthlyBestCareTaker
            ): Promise<MonthlyBestCareTakerDetails> => {
                const specializesRows: QueryResult<SpecializesIn> = await asyncQuery(
                    specializes_query.get_specializes,
                    [ct.ct_email]
                );
                const specializes = specializesRows.rows;
                return { ...ct, all_specializes: specializes };
            }
        );

        console.log(bestCareTakerDetails);

        const response: MonthlyBestCareTakerIndexResponse = {
            data: bestCareTakerDetails,
            error: ""
        };
    } catch (error) {
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: error
        };
        res.status(400).send(response);
    }
};
