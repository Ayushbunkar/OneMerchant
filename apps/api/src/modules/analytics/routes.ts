import { Router } from "express";
import { analyticsController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/dashboard", asyncHandler(analyticsController.dashboard));
router.get("/revenue", asyncHandler(analyticsController.revenue));
router.get("/top-products", asyncHandler(analyticsController.topProducts));
router.get("/sales-by-category", asyncHandler(analyticsController.salesByCategory));

export default router;
