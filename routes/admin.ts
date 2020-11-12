import { Router } from "express";
import { verifyAdminToken } from "../middleware/auth";
import * as petsController from "../controllers/petsController";
import * as adminController from "../controllers/adminController";

export const router = Router();

// router.use(verifyAdminToken);

/**
 * FOR EXAMPLE, USING PETS controller controller only just cos
 */

router.get("/monthly_revenue/", adminController.indexRevenue);
router.get(
    "/best_caretakers_monthly/",
    adminController.indexRevenueByBestCareTaker
);
router.get("/:owner", petsController.index);
router.get("/:owner/:name", petsController.get);
router.post("/", petsController.create);

export default router;
