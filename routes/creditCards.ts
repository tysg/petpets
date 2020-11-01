import { Router } from "express";
import * as creditCardsController from "../controllers/creditCardsController";

export const router = Router();

router.post("/", creditCardsController.create);
router.patch("/:cardholder/:cardNumber", creditCardsController.update);
router.delete("/:cardholder/:cardNumber", creditCardsController.remove);
router.get("/:cardholder", creditCardsController.index);
router.get("/:cardholder/:cardNumber", creditCardsController.get);

export default router;
