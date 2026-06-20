import { Router } from "express";
import { notificationController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(notificationController.list));
router.patch("/:id/read", asyncHandler(notificationController.markAsRead));
router.patch("/read-all", asyncHandler(notificationController.markAllAsRead));

export default router;
