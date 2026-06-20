import { Router } from "express";
import { customerController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(customerController.list));
router.get("/segments", asyncHandler(customerController.getSegments));
router.get("/:id", asyncHandler(customerController.get));
router.get("/:id/history", asyncHandler(customerController.getHistory));
router.post("/", asyncHandler(customerController.create));
router.put("/:id", asyncHandler(customerController.update));

export default router;
