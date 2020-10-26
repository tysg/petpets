import jwt from 'jsonwebtoken';
// const config = require("../config/auth.config.js");
// const db = require("../models");
// const User = db.user;

const secret = process.env.SECRET!;

const verifyToken = (req: any, res: any, next: any) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    // fix type error
    token = Array.isArray(token) ? token[0] : token;

    jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};


export const authJwt = { verifyToken };