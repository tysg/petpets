import { Router } from "express";
import userController from "./../controllers/userController";
import pets from "./pets";
import credit_cards from "./creditCards";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("Expressss + TypeScript Server");
  console.log("hi");
});

apiRouter.get("/ping", (req, res) => res.send("PONG"));

apiRouter.post("/login", userController.signIn);
apiRouter.post("/signup", userController.signUp);

apiRouter.use("/pets", pets);
apiRouter.use("/credit_cards", credit_cards);
