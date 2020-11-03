import { Request, Response } from "express";
import { QueryResult } from "pg";
import {
    Pet,
    IndexResponse,
    PetResponse,
    StringResponse,
    sqlify,
    PetCategoriesResponse,
    PetCategory
} from "../models/pet";
import { asyncQuery } from "./../utils/db";
import { pet_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";
import { assert } from "console";
import { errorResponse } from "../utils/errorFactory";
import { ApiResponse } from "../models";

export const index = async (req: Request, res: Response) => {
    try {
        const { owner } = req.params;
        const qr: QueryResult<Pet> = await asyncQuery(pet_query.index_owner, [
            owner
        ]);
        const { rows } = qr;
        const response: IndexResponse = {
            data: rows,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { owner } = req.params;
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${owner} not found:` + error
        };
        res.status(400).send(response);
    }
};

export const get = async (req: Request, res: Response) => {
    try {
        const { name, owner } = req.params;
        const qr: QueryResult<Pet> = await asyncQuery(pet_query.get_pet, [
            name,
            owner
        ]);
        const { rows } = qr;
        assert(rows.length == 1, "PK somehow unenforced!"); // By right if PK has been enforced
        const response: PetResponse = {
            data: rows[0],
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { name, owner } = req.params;
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${name} ${owner} not found:` + error
        };
        res.status(400).send(response);
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { name, owner } = req.params;
        await asyncQuery(pet_query.delete_pet, [name, owner]);
        const response: StringResponse = {
            data: `${name} ${owner} has been deleted`,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { name, owner } = req.params;
        log.error("delete pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${name} ${owner} cannot be deleted:` + error
        };
        res.status(400).send(response);
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const pet: Pet = req.body;
        await asyncQuery(pet_query.create_pet, sqlify(pet));
        const response: PetResponse = {
            data: pet,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { name, owner } = req.body;
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${name} ${owner} cannot be created:` + error
        };
        res.status(400).send(response);
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const pet: Pet = req.body;
        await asyncQuery(pet_query.update_pet, sqlify(pet));
        const response: PetResponse = {
            data: pet,
            error: ""
        };
        res.send(response);
    } catch (error) {
        const { name, owner } = req.body;
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${name} ${owner} cannot be updated:` + error
        };
        res.status(400).send(response);
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const qr = await asyncQuery(pet_query.get_pet_categories);
        const { rows } = qr;

        const data: PetCategory[] = rows.map((value) => ({
            typeName: value.type_name,
            baseDailyPrice: value.base_daily_price
        }));

        const response: PetCategoriesResponse = {
            data,
            error: ""
        };
        res.send(response);
    } catch (error) {
        log.error("get pet categories error: ", error);
        res.status(400).send(errorResponse(`Error getting pet categories.`));
    }
};

export const putCategory = async (req: Request, res: Response) => {
    const { typeName, baseDailyPrice } = req.body;
    try {
        const qr = await asyncQuery(pet_query.select_pet_category, [typeName]);
        const { rows } = qr;

        if (rows[0]) {
            asyncQuery(pet_query.update_pet_category, [
                typeName,
                baseDailyPrice
            ])
                .then((ret) => {
                    const response: ApiResponse<QueryResult<any>, string> = {
                        data: ret,
                        error: ""
                    };
                    res.send(response);
                })
                .catch((err) =>
                    res
                        .status(400)
                        .send(errorResponse("Update pet category failed"))
                );
        } else {
            asyncQuery(pet_query.create_pet_category, [
                typeName,
                baseDailyPrice
            ])
                .then((ret) => {
                    const response: ApiResponse<QueryResult<any>, string> = {
                        data: ret,
                        error: ""
                    };
                    res.send(response);
                })
                .catch((err) =>
                    res
                        .status(400)
                        .send(errorResponse("Create new pet category failed"))
                );
        }
    } catch (err) {
        log.error("select pet category error:", err);
        res.status(400).send(errorResponse("Error getting pet category."));
    }
};

export const removeCategory = async (req: Request, res: Response) => {
    log.controller("reached category", req.params);
    const { typeName } = req.params;
    try {
        await asyncQuery(pet_query.delete_pet_category, [typeName]);
        const response: StringResponse = {
            data: `${typeName} has been deleted`,
            error: ""
        };
        res.send(response);
    } catch (err) {
        log.error("Delete pet category error:", err);
        res.status(400).send(errorResponse("Error removing pet category."));
    }
};
