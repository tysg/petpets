import { Request, Response } from "express";
import { SignUpRequest, SignUpResponse } from "./../models/user";
import { asyncQuery } from "./../utils/db";
import sql from "./../sql/sql_query";
import { log } from "./../utils/logging";
import bcrypt from "bcrypt";


const round = 10
const salt = bcrypt.genSaltSync(round)

const signupController = async (req: Request, res: Response) => {
    const body: SignUpRequest = req.body;
    // TODO: add salt
    const hashedPassword = bcrypt.hashSync(body.password, salt)
    try {
        await asyncQuery(sql.add_user, [body.email, hashedPassword, body.firstName, body.lastName])
        const response: SignUpResponse = {
            data: "Success!",
            error: ""
        }
        res.send(response)
    } catch (error) {
        log.error("Error in adding user", error)
        const response: SignUpResponse = {
            data: "",
            error: "Sign-up failed: " + error
        }
        res.status(400).send(response)
    }
}


export { signupController }