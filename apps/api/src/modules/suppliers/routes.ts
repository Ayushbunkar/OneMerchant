import { Router } from "express";
import { supplierController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(supplierController.list));
router.get("/:id", asyncHandler(supplierController.get));
router.post("/", asyncHandler(supplierController.create));
router.put("/:id", asyncHandler(supplierController.update));
router.post("/purchase-orders", asyncHandler(supplierController.createPO));
router.post("/purchase-orders/:id/receive", asyncHandler(supplierController.receivePO));

export default router;
