import { Router } from "express";
import userController from "./../controllers/userController";
import pets from "./pets";
import credit_cards from "./creditCards";
import { verifyToken } from "./../middleware/auth";
import schedules from "./schedules";
import careTakers from "./careTakers";

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

// apiRouter.post("/login", (req, res) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) console.log("error", err);
//     if (!user) return res.status(401).send({ errorMessage: "User not found" });
//     console.log("user", user);
//     console.log("info", info);
//     return res.send({ msg: "success", info });
//   })(req, res);
// });

apiRouter.use("/pets", pets);
apiRouter.use("/credit_cards", credit_cards);
apiRouter.use("/caretakers", careTakers);
apiRouter.use("/schedules", schedules);
