import { Request, Response } from "express";
import {
  SignUpResponse,
  NewUser,
  SignInRequest,
  SignInResponse,
} from "./../models/user";
import { asyncQuery } from "./../utils/db";
import { user_query } from "./../sql/sql_query";
import { log } from "./../utils/logging";
import bcrypt from "bcrypt";
import { QueryResult } from "pg";
import { errorResponse } from "../utils/errorFactory";
import jwt from "jsonwebtoken";

import { SECRET } from "./../utils/config";

const round = 10;
const salt = bcrypt.genSaltSync(round);

const signUp = async (req: Request, res: Response) => {
  const body: NewUser = req.body;
  const hashedPassword = bcrypt.hashSync(body.password, salt);
  try {
    await asyncQuery(user_query.add_user, [
      body.email,
      body.username,
      hashedPassword,
      body.address,
      body.phone,
      body.avatarUrl,
    ]);
    const response: SignUpResponse = {
      data: "Success!",
      error: "",
    };
    res.send(response);
  } catch (error) {
    log.error("Error in adding user", error);
    res.status(400).send(errorResponse("Sign-up failed: " + error));
  }
};

const signIn = async (req: Request, res: Response) => {
  const body: SignInRequest = req.body;
  console.log(body);

  try {
    type UserPass = Record<
      "email" | "username" | "password" | "avatar_link",
      string
    >;
    const qr: QueryResult<UserPass> = await asyncQuery(user_query.userpass, [
      body.email,
    ]);
    // compare password
    if (!qr || qr.rows.length < 1) {
      return res.status(404).send(errorResponse("User Not found."));
    }
    const userPass = qr.rows[0];
    const isValidPassword = bcrypt.compareSync(
      body.password,
      userPass.password
    );

    if (!isValidPassword) {
      return res.status(401).send(errorResponse("Wrong password!"));
    }

    const token = jwt.sign({ email: userPass.email }, SECRET, {
      expiresIn: 86400, // 24 hours
    });

    const response: SignInResponse = {
      data: {
        accessToken: token,
        avatarUrl: userPass.avatar_link,
        email: userPass.email,
        username: userPass.username,
      },
      error: "",
    };
    res.send(response);
  } catch (error) {
    log.error("Error in signing in", error);
    res.status(400).send(errorResponse("Sign-in failed: " + error));
  }
};

export default { signUp, signIn };
