import { Router } from "express";
import * as careTakersController from "../controllers/careTakersController";

export const router = Router();

router.post("/", careTakersController.create);
router.post("/:email", careTakersController.update);
router.get("/", careTakersController.index);
router.get("/:email", careTakersController.get);

export default router;
