import { Router } from "express";
import { authController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refreshToken));
router.get("/profile", authenticate, asyncHandler(authController.getProfile));
router.post("/logout", authenticate, asyncHandler(authController.logout));

export default router;
