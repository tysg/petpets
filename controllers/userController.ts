import { Request, Response } from "express";
import { SignUpResponse, NewUser } from "./../models/user";
import { asyncQuery } from "./../utils/db";
import sql from "./../sql/sql_query";
import { log } from "./../utils/logging";
import bcrypt from "bcrypt";


const round = 10;
const salt = bcrypt.genSaltSync(round);

const signUp = async (req: Request, res: Response) => {
    const body: NewUser = req.body;
    const hashedPassword = bcrypt.hashSync(body.password, salt);
    try {
        await asyncQuery(sql.add_user, [body.email, body.username, hashedPassword, body.address, body.phone, body.avatarUrl]);
        const response: SignUpResponse = {
            data: "Success!",
            error: ""
        };
        res.send(response);
    } catch (error) {
        log.error("Error in adding user", error);
        const response: SignUpResponse = {
            data: "",
            error: "Sign-up failed: " + error
        };
        res.status(400).send(response);
    }
};


export default { signUp };