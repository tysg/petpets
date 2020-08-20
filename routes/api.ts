import { Router } from "express";

export const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("Expressss + TypeScript Server"));
apiRouter.get("/ping", (req, res) => res.send("PONG"));
