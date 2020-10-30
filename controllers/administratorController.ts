import { Request, Response } from "express";
import {
  Administrator,
  SignInRequest,
  SignInResponse,
} from "./../models/administrator";
import { asyncQuery } from "./../utils/db";
import { administrator_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";
import bcrypt from "bcrypt";
import { QueryResult } from "pg";
import { errorResponse } from "../utils/errorFactory";
import jwt from "jsonwebtoken";

import { SECRET } from "./../utils/config";

const round = 10;
const salt = bcrypt.genSaltSync(round);

const administratorSignIn = async (req: Request, res: Response) => {
  const body: SignInRequest = req.body;
  console.log(body);

  try {
    type AdministratorPass = Record<
      "email" | "password",
      string
    >;
    const qr: QueryResult<AdministratorPass> = await asyncQuery(administrator_query.administratorlogin, [
      body.email,
    ]);
    // compare password
    if (!qr || qr.rows.length < 1) {
      return res.status(404).send(errorResponse("User Not found."));
    }
    const administratorPass = qr.rows[0];
    const isValidPassword = bcrypt.compareSync(
      body.password,
      administratorPass.password
    );

    if (!isValidPassword) {
      return res.status(401).send(errorResponse("Wrong password!"));
    }

    const token = jwt.sign({ email: administratorPass.email }, SECRET, {
      expiresIn: 86400, // 24 hours
    });

    const response: SignInResponse = {
      data: {
        accessToken: token,
        email: administratorPass.email,
      },
      error: "",
    };
    res.send(response);
  } catch (error) {
    log.error("Error in signing in", error);
    res.status(400).send(errorResponse("Sign-in failed: " + error));
  }
};

export default { administratorSignIn  };
