import { Router } from "express";
import { whatsappController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();
router.use(authenticate);

router.post("/send", asyncHandler(whatsappController.sendMessage));
router.post("/sync-catalog", asyncHandler(whatsappController.syncCatalog));

export default router;
