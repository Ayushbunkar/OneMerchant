import { Router } from "express";
import multer from "multer";
import { mediaController } from "./controller.js";
import { authenticate } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB max

const router = Router();
router.use(authenticate);

router.get("/", asyncHandler(mediaController.list));
router.post("/upload", upload.single("file"), asyncHandler(mediaController.upload));
router.delete("/:id", asyncHandler(mediaController.delete));

export default router;
