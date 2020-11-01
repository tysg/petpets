import { Router } from "express";
import * as schedulesController from "../controllers/schedulesController";

export const router = Router();

router.get("/part_timer/:email", schedulesController.indexPartTimer);
router.get("/full_timer/:email", schedulesController.indexFullTimer);
router.post("/part_timer", schedulesController.createPartTimer);
router.post("/full_timer", schedulesController.createFullTimer);
router.delete("/", schedulesController.remove);

export default router;
