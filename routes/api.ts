import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Pool } from "pg";

const findUser = (username: String, callback: Function) => {
  console.log("finding user", username);
  // make a call to pg here
  if (username === "admin") {
    callback(null, { passwordHash: "admin" });
  } else {
    callback("cannot find user", null);
  }
};

passport.use(
  new LocalStrategy((username, password, done) => {
    // return done(null, { user: "admin" });
    findUser(username, (err: any, user: any) => {
      if (err) return done(err);
      if (!user) return done(null, false);

      bcrypt.compare(password, user.passwordHash, (err, isValid) => {
        if (err) return done(err);
        if (!isValid) return done(null, false);
        return done(null, user);
      });
    });
  })
);

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("Expressss + TypeScript Server");
  console.log("hi");
});
apiRouter.get("/ping", (req, res) => res.send("PONG"));
// apiRouter.post("/login", (req, res) => res.send(req.body));
apiRouter.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) console.log("error", err);
    if (!user) return res.status(401).send({ error: "User not found" });
    console.log("user", user);
    console.log("info", info);
    return res.send({ msg: "success", info });
  })(req, res);
});
