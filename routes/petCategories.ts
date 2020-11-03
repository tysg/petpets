import { Router } from "express";
import * as petsController from "../controllers/petsController";

export const router = Router();

router.get("/", petsController.getCategories);
router.put("/", petsController.putCategory);
router.delete("/:typeName", petsController.removeCategory);

export default router;
