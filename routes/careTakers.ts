import { Router } from "express";
import * as careTakersController from "../controllers/careTakersController";

export const router = Router();

router.get("/", careTakersController.index);
router.get("/search", careTakersController.search);
router.get("/:email", careTakersController.get);
router.delete("/:email", careTakersController.remove);
router.patch("/part_timer/:email", careTakersController.updatePartTimer);
router.patch("/full_timer/:email", careTakersController.updateFullTimer);
router.post("/part_timer", careTakersController.createPartTimer);
router.post("/full_timer", careTakersController.createFullTimer);
router.get("/payment/:email", careTakersController.payments);

export default router;
