import { Router } from "express";
import userController from "./../controllers/userController";
import pets from "./pets";
import credit_cards from "./creditCards";
import { verifyToken } from "./../middleware/auth";
import schedules from "./schedules";
import careTakers from "./careTakers";
import admin from "./admin";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
    res.send("Expressss + TypeScript Server");
    console.log("hi");
});

apiRouter.get("/ping", verifyToken, (req, res) => res.send("PONG"));

apiRouter.post("/login", userController.signIn);
apiRouter.post("/signup", userController.signUp);
apiRouter.post("/verifyToken", verifyToken, (req, res) =>
    res.status(200).send("OK")
);

apiRouter.use("/admin", admin);
apiRouter.use("/pets", pets);
apiRouter.use("/credit_cards", credit_cards);
apiRouter.use("/caretakers", careTakers);
apiRouter.use("/schedules", schedules);
