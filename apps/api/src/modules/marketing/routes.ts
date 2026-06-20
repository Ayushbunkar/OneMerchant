import { Router } from "express";
import { marketingController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/campaigns", asyncHandler(marketingController.listCampaigns));
router.post("/campaigns", asyncHandler(marketingController.createCampaign));
router.put("/campaigns/:id", asyncHandler(marketingController.updateCampaign));
router.get("/coupons", asyncHandler(marketingController.listCoupons));
router.post("/coupons", asyncHandler(marketingController.createCoupon));
router.post("/coupons/validate", asyncHandler(marketingController.validateCoupon));

export default router;
