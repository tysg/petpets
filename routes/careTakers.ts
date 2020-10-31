import { Router } from "express";
import * as careTakersController from "../controllers/careTakersController";

export const router = Router();

router.get("/", careTakersController.index);
router.get("/search", careTakersController.search);
router.get("/:email", careTakersController.get);
router.post("/", careTakersController.create);
router.delete("/:email", careTakersController.remove);

export default router;
