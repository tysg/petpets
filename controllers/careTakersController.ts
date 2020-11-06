import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    MonthlyPayment,
    CareTaker,
    CareTakerDetails,
    SearchResponse,
    CareTakerSpecializesInCategorySchema,
    SpecializesIn,
    IndexResponse,
    GetResponse,
    StringResponse,
    MonthlyPaymentsResponse,
    CaretakerStatus,
    CareTakerSchema,
    SpecializesInSchema,
    CareTakerSpecializesDetailsSchema,
    CareTakerSpecializesDetails,
    CareTakerDetailsSchema,
    CareTakerSpecializesInCategory
} from "../models/careTaker";
import { asyncQuery, asyncTransaction } from "./../utils/db";
import {
    caretaker_query,
    payments_query,
    specializes_query
} from "./../sql/sql_query";
import { log } from "./../utils/logging";
import * as yup from "yup";

const mapCareTakerAttr = (r: any): CareTakerDetails => ({
    email: r.email,
    avatarUrl: r.avatarurl ?? undefined,
    rating: r.rating,
    phone: r.phone,
    fullname: r.fullname,
    caretakerStatus: r.caretakerstatus,
    address: r.address
});

const mapSpecializes = (sp: any): SpecializesIn => ({
    typeName: sp.typename,
    ctPriceDaily: sp.ctpricedaily
});

const mapSearchResponse = (r: any) => ({
    email: r.email,
    avatarUrl: r.avatarurl ?? undefined,
    rating: r.rating,
    phone: r.phone,
    fullname: r.fullname,
    caretakerStatus: r.caretakerstatus,
    address: r.address,
    typeName: r.typename,
    ctPriceDaily: r.ctpricedaily
});

export const payments = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        // TODO check jwt email same as req.params.email
        const ctQueryResult: QueryResult<CareTakerDetails> = await asyncQuery(
            caretaker_query.get_caretaker,
            [email]
        );

        const careTakerDetails = mapCareTakerAttr(ctQueryResult.rows[0]);
        const paymentQuery =
            careTakerDetails.caretakerStatus == CaretakerStatus.partTimeCt
                ? payments_query.get_pt_caretaker_payments
                : payments_query.get_ft_caretaker_payments;

        const ctPaymentQuery: QueryResult<MonthlyPayment> = await asyncQuery(
            paymentQuery,
            [email]
        );

        const response: MonthlyPaymentsResponse = {
            data: {
                monthly_payment: ctPaymentQuery.rows
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

export const index = async (req: Request, res: Response) => {
    try {
        const qr: QueryResult<CareTakerDetails> = await asyncQuery(
            caretaker_query.index_caretaker,
            []
        );
        const rows = qr.rows.map(mapCareTakerAttr);
        yup.array(CareTakerDetailsSchema)
            .defined()
            .validate(rows)
            .then((rows) => {
                const response: IndexResponse = {
                    data: rows,
                    error: ""
                };
                res.send(response);
            })
            .catch(console.log);
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
        const qr: QueryResult<CareTakerSpecializesInCategory> = await asyncQuery(
            caretaker_query.search_caretaker,
            [`${start_date}`, `${end_date}`, `${pet_category}`]
        );
        // TODO add check for no existing bookings
        // TODO add check for PT for rating > some value and caring < 5
        const rows = qr.rows.map(mapSearchResponse);
        yup.array(CareTakerSpecializesInCategorySchema)
            .defined()
            .validate(rows)
            .then((rows) => {
                const response: SearchResponse = {
                    data: rows,
                    error: ""
                };
                res.send(response);
            })
            .catch(console.log);
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
        const careTakerDetails = ctQueryResult.rows.map(mapCareTakerAttr);
        const specializesIn = specialzesQueryResult.rows.map(mapSpecializes);
        const data = {
            ...careTakerDetails[0],
            allSpecializes: specializesIn
        };

        CareTakerSpecializesDetailsSchema.validate(data)
            .then((data) => {
                const response: GetResponse = {
                    data: data,
                    error: ""
                };
                res.send(response);
            })
            .catch(console.log);
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
            ctStatus == CaretakerStatus.partTimeCt
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
            ctStatus == CaretakerStatus.partTimeCt
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

export const createPartTimer = create(CaretakerStatus.partTimeCt);
export const createFullTimer = create(CaretakerStatus.fullTimeCt);

export const updatePartTimer = update(CaretakerStatus.partTimeCt);
export const updateFullTimer = update(CaretakerStatus.fullTimeCt);
