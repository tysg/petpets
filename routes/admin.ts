import { Router } from "express";
import { verifyAdminToken } from "../middleware/auth";
import * as adminController from "../controllers/adminController";

export const router = Router();

router.use(verifyAdminToken);

/**
 * data is MonthlyRevenueIndexResponse
 */
router.get("/monthly_revenue/", adminController.indexRevenue);

/**
 * data is MonthlyBestCareTakerIndexResponse
 */
router.get(
    "/best_caretakers_monthly/:year_month",
    adminController.indexRevenueByBestCareTaker
);

export default router;
