import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => {
  res.send("Expressss + TypeScript Server");
  console.log("hi");
});
apiRouter.get("/ping", (req, res) => res.send("PONG"));
apiRouter.get("/test", (req, res) => res.send("PONG"));
apiRouter.post("/login", (req, res) => res.send(req.body));
