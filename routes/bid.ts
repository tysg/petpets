import { Router } from "express";
import * as bidsController from "../controllers/bidsController";

export const router = Router();

router.post("/", bidsController.create);

router.patch(
    "/:ct_email/:pet_owner/:pet_name/:start_date/:end_date",
    bidsController.update
);
router.delete(
    "/:ct_email/:pet_owner/:pet_name/:start_date/:end_date",
    bidsController.remove
);
router.get("/owner/:pet_owner", bidsController.owner_get);
router.get("/caretaker/:ct_email", bidsController.ct_get);

export default router;
