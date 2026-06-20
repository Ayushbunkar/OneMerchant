import { Router } from "express";
import { paymentController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(paymentController.list));
router.get("/summary", asyncHandler(paymentController.summary));
router.post("/", asyncHandler(paymentController.record));

export default router;
