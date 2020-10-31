import { Router } from "express";
import * as schedulesController from "../controllers/schedulesController";

export const router = Router();

router.get("/:email/:caretaker_status", schedulesController.index);
router.post("/", schedulesController.create);
router.delete("/:email", schedulesController.remove);

export default router;
