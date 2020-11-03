import { Router } from "express";
import * as bidsController from "../controllers/bidsController";

export const router = Router();

router.post("/", bidsController.create);
router.patch("/", bidsController.update);
router.delete("/", bidsController.remove);
router.get("/owner/:owner_email", bidsController.owner_get);
router.get("/caretaker/:ct_email", bidsController.ct_get);

export default router;
