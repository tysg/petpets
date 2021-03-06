import { Router } from "express";
import userController from "./../controllers/userController";
import pets from "./pets";
import petCategories from "./petCategories";
import creditCards from "./creditCards";
import { verifyToken } from "./../middleware/auth";
import schedules from "./schedules";
import careTakers from "./careTakers";
import admin from "./admin";
import bids from "./bid";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
    res.send("Expressss + TypeScript Server");
    console.log("hi");
});

apiRouter.get("/ping", verifyToken, (req, res) => res.send("PONG"));

apiRouter.post("/login", userController.signIn);
apiRouter.post("/signup", userController.signUp);
apiRouter.patch("/profile/:email", userController.update);
apiRouter.post("/verifyToken", verifyToken, (req, res) =>
    res.status(200).send("OK")
);

apiRouter.use("/admin", admin);
apiRouter.use("/pets", pets);
apiRouter.use("/petCategories", petCategories);
apiRouter.use("/creditCards", creditCards);
apiRouter.use("/caretakers", careTakers);
apiRouter.use("/schedules", schedules);
apiRouter.use("/bids", bids);
