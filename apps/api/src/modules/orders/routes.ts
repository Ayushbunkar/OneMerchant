import { Router } from "express";
import { orderController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(orderController.list));
router.get("/:id", asyncHandler(orderController.get));
router.post("/", asyncHandler(orderController.create));
router.patch("/:id/status", asyncHandler(orderController.updateStatus));

export default router;
