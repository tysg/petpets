import { Router } from "express";
import * as petsController from "../controllers/petsController";

export const router = Router();

router.get("/", petsController.getCategories);
router.post("/", petsController.createCategory);
router.patch("/:typeName", petsController.patchCategory);
router.delete("/:typeName", petsController.removeCategory);

export default router;
