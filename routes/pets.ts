import { Router } from "express";
import * as petsController from "../controllers/petsController";

export const router = Router();

router.post("/", petsController.create);
router.patch("/:owner/:name", petsController.update);
router.delete("/:owner/:name", petsController.remove);
router.get("/:owner", petsController.index);
router.get("/:owner/:name", petsController.get);

export default router;
