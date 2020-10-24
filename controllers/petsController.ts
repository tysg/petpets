import { Request, Response } from "express";
import { QueryResult } from "pg";
import { Pet, IndexResponse, PetResponse, StringResponse, sqlify } from "../models/pet";
import { asyncQuery } from "./../utils/db";
import { pet_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";
import { assert } from "console";

export const index = async (req: Request, res: Response) => {
    try {
        const { owner } = req.params;
        const qr: QueryResult<Pet> = await asyncQuery(pet_query.index_owner, [owner]);
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
        const qr: QueryResult<Pet> = await asyncQuery(pet_query.get_pet, [name, owner]);
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
        const { name, owner } = req.params;
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${name} ${owner} cannot be created:` + error
        };
        res.status(400).send(response);
    }
}

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
        const { name, email } = req.params;
        log.error("get pet error", error);
        const response: StringResponse = {
            data: "",
            error: `Pet ${name} ${email} cannot be updated:` + error
        };
        res.status(400).send(response);
    }
}



