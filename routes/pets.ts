import { Router } from "express";
import * as petsController from "../controllers/petsController";

export const router = Router();

router.get("/:name/:owner", petsController.get);
router.delete("/:name/:owner", petsController.remove);
router.post("/", petsController.create);
router.patch("/:name/:owner", petsController.update);


export default router;
